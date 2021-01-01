import { times } from 'lodash';
import moment from 'moment';
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
        let orderId = result[i].id;
        console.log(orderId)
        let sql = 'SELECT i.*,io.order_id from item_order io INNER JOIN item i on io.item_id = i.id WHERE io.order_id = ?';
        const itemsInOrder = await dbUtil.query(sql, [orderId]);
        result[i] = {
            ...result[i],
            items: itemsInOrder
        }
    }
    return result;
}

export const cancelOrderDAL = async (orderId) => {
    let sql = 'update `order` set status = 4 where id = ?';
    const result = await dbUtil.query(sql, [orderId]);
}