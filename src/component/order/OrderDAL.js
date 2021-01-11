import { times } from 'lodash';
import moment from 'moment';
import { add } from 'winston';
import { ERRORS } from '../../constant/Errors';
import * as dbUtil from '../../util/DatabaseUtil';

export const createOrderWithItemDAL = async (userId, items) => {

    const transaction = await dbUtil.beginTransaction();
    try {
        // tạo đơn hàng - userId
        let timestamp = moment().format('YYYY-MM-DD hh:mm:ss');
        console.log('time:', timestamp)
        let createOrderParams = [userId, timestamp];
        let createOrderSql = 'insert into `order` (`user_id`,`created_time`,`status`) values (?,?,1)';
        await dbUtil.executeInTransaction(createOrderSql, createOrderParams, transaction).catch(err => {
            throw err
        });

        // get id đơn hàng đó
        let getOrderIdSql = 'select id from `order` order by id desc limit 1';
        let getOrderParams = [userId, timestamp, 1];
        const orderIdResponse = await dbUtil.executeInTransaction(getOrderIdSql, getOrderParams, transaction).catch(err => {
            throw err
        });
        let orderId = orderIdResponse[0].id;
        if (!orderId) {
            throw ERRORS.NOTHING_CHANGED
        }

        // insert vào bảng order_item
        for (let i = 0; i < items.length; i++) {
            let insertOrderItemSql = 'insert into item_order (item_id,order_id) values (?,?)';
            let insertOrderItemParams = [items[i], orderId];
            await dbUtil.executeInTransaction(insertOrderItemSql, insertOrderItemParams, transaction).catch(err => {
                throw err
            });
        }

        await dbUtil.commitTransaction(transaction);
        return orderId;
    } catch (e) {
        await dbUtil.rollbackTransaction(transaction);
        return Promise.reject(e);
    }
}

export const getMyOrdersDAL = async (userId) => {
    let sql = 'select * from `order` where user_id = ? and status != 4 order by `created_time` DESC';
    const result = await dbUtil.query(sql, [userId]);
    for (let i = 0; i < result.length; i++) {
        let debug = false;
        if (i == 0) {
            debug = true;
        } else {
            debug = false;
        }
        // 1 order
        delete result[i].user_id
        let orderId = result[i].id;
        console.log(orderId)
        let sql = 'SELECT i.* from item_order io INNER JOIN item i on io.item_id = i.id WHERE io.order_id = ?';
        const itemsInOrder = await dbUtil.query(sql, [orderId]);
        // order0's item : [1 5 5 5 1 3]
        let distinctItem = []

        for (let j = 0; j < itemsInOrder.length; j++) {
            if (distinctItem.length == 0) {
                distinctItem.push(itemsInOrder[j])
            } else {
                let isDuplicate = false;
                for (let k = 0; k < distinctItem.length; k++) {
                    if (distinctItem[k].id == itemsInOrder[j].id) {
                        isDuplicate = true;
                        break;
                    }
                }
                if (!isDuplicate) {
                    distinctItem.push(itemsInOrder[j])
                }
            }
        }

        for (let j = 0; j < distinctItem.length; j++) {

            delete distinctItem[j].amount
            delete distinctItem[j].deleted

            distinctItem[j] = {
                ...distinctItem[j],
                count: 0
            }
        }

        for (let j = 0; j < distinctItem.length; j++) {
            for (let k = 0; k < itemsInOrder.length; k++) {
                if (itemsInOrder[k].id == distinctItem[j].id) {
                    distinctItem[j].count++;
                }
            }
        }
        let totalMoney = 0;
        for (let j = 0; j < itemsInOrder.length; j++) {
            totalMoney += itemsInOrder[j].price
        }
        result[i] = {
            ...result[i],
            totalMoney: totalMoney,
            items: distinctItem
        }
    }
    return result;
}

export const cancelOrderDAL = async (orderId) => {
    let sql = 'update `order` set status = 4 where id = ?';
    const result = await dbUtil.query(sql, [orderId]);
    return result;
}

export const getAllOrderDAL = async () => {
    let sql = 'SELECT o.id as order_id, o.created_time as create_time, o.`status` as `status`,a.id as user_id, a.address as address, a.fullname as fullname from `order` o INNER JOIN account a on o.user_id = a.id';
    const result = await dbUtil.query(sql, []);
    return result;
}

export const executeOrderDAL = async (orderId) => {

    const transaction = await dbUtil.beginTransaction();
    try {
        // check còn hàng thì mới cho chốt => get all item của đơn hàng đấy
        let isAbleToExecuteOrder = true;
        let getItemInOrderSql = 'select *,count(item_id) as item_amount from `item_order` WHERE order_id = ? GROUP BY item_id;';
        const itemInOrderData = await dbUtil.executeInTransaction(getItemInOrderSql, [orderId], transaction).catch(err => {
            throw err;
        });
        console.warn('itemInOrder:', itemInOrderData)
        for (let i = 0; i < itemInOrderData.length; i++) {
            let getItemAmountSql = 'select amount from item where id = ?';
            let itemId = itemInOrderData[i].item_id;
            const res = await dbUtil.executeInTransaction(getItemAmountSql, [itemId], transaction).catch(err => {
                throw err;
            });
            let itemAmount = res[0].amount
            if (itemAmount < itemInOrderData[i].item_amount) {
                isAbleToExecuteOrder = false;
                break;
            }
        }
        if (isAbleToExecuteOrder) {
            // update lại hết số lượng các mặt hàng
            for (let i = 0; i < itemInOrderData.length; i++) {
                let updateItemAmountSql = 'UPDATE item set amount = amount - ? where id = ?;'
                await dbUtil.executeInTransaction(updateItemAmountSql, [itemInOrderData[i].item_amount, itemInOrderData[i].item_id], transaction).catch(err => {
                    throw err;
                });
            }
            // update đơn hàng
            let updateOrderSql = 'update `order` set status = 2 where id = ?';
            await dbUtil.executeInTransaction(updateOrderSql, [orderId], transaction).catch(err => {
                throw err;
            });
        } else {
            throw 'Không đủ mặt hàng trong kho, không thể xuất đơn hàng.';
        }
        await dbUtil.commitTransaction(transaction);
        return true;
    } catch (e) {
        await dbUtil.rollbackTransaction(transaction);
        return Promise.reject(e);
    }
}

export const getOrderDetailDAL = async (orderId) => {
    let sql = 'select i.id as item_id,i.price,i.name as item_name,o.created_time as order_created_time,o.`status` as order_status,a.fullname,a.address,count(i.name) as amount from `item_order` io INNER JOIN item i on io.item_id = i.id INNER JOIN `order` o on io.order_id = o.id INNER JOIN account a ON o.user_id = a.id WHERE order_id = ? GROUP BY item_name'
    let result = await dbUtil.query(sql, [orderId])
    let orderCreatedTime = result[0]?.order_created_time
    let orderStatus = result[0]?.order_status
    let fullname = result[0]?.fullname
    let address = result[0]?.address
    let sum = 0;
    for (let i = 0; i < result.length; i++) {
        delete result[i]?.order_created_time
        delete result[i]?.order_status
        delete result[i]?.fullname
        delete result[i]?.address
        sum += result[i].price * result[i].amount;
    }
    let data = {
        orderCreatedTime: orderCreatedTime,
        orderStatus: orderStatus,
        fullname: fullname,
        address: address,
        item: result,
        totalMoney: sum
    }
    return data;
}