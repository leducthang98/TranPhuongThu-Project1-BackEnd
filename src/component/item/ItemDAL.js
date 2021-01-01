import * as dbUtil from '../../util/DatabaseUtil';

export const createItemDAL = async (item) => {
    let sql = 'insert into item (name, type, price, description, amount, image, deleted) values (?, ?, ?, ?, ?, ?, 0)';
    const result = await dbUtil.query(sql, [item.name, item.type, item.price || 0, item.description, item.amount || 0, item.image]);
    return result;
}

export const getAllItemDAL = async (req) => {
    let type = req?.query.type;
    let sortColumn = req?.query?.sortColumn;
    let sortType = req?.query?.sortType; // 1: ASC, 0 DESC 
    if (sortType == 0) {
        sortType = 'DESC'
    } else {
        sortType = 'ASC'
    }

    let sql = 'select * from item where deleted = 0';
    let params = []
    if (type) {
        sql += ' and type = ?';
        params.push(type)
    }
    if (sortColumn) {
        sql += ' order by ' + sortColumn + ' ' + sortType;
    }
    const result = await dbUtil.query(sql, params);
    return result;
}

export const getItemByIdDAL = async (id) => {
    let sql = 'select * from item where id = ?';
    const result = await dbUtil.queryOne(sql, [id])
    return result;
}

export const searchItemDAL = async (searchData, type) => {
    let sql = 'select * from item where 1 = 1';
    let params = []
    if (type) {
        sql += ' and type = ?';
        params.push(type);
    }
    if (searchData) {
        sql += ' and lower(name) like ?';
        params.push('%' + searchData.toLowerCase() + '%');
    }
    const result = await dbUtil.query(sql, params);
    return result;
}

export const updateItemDAL = async (itemId, data) => {
    let updatePart = 'update item set id = id';
    let params = []
    if (data.name) {
        updatePart += ', name = ?';
        params.push(data.name)
    }
    if (data.type) {
        if (data.type != 1 && data.type != 2) {
            throw 'Invalid input param: type';
        } else {
            updatePart += ', type = ?';
            params.push(data.type)
        }
    }
    if (data.description) {
        updatePart += ', description = ?';
        params.push(data.description)
    }
    if (data.price) {
        updatePart += ', price = ?';
        params.push(data.price)
    }
    if (data.amount) {
        if (data.amount < 0) {
            throw 'Invalid input param: amount';
        }
        updatePart += ', amount = ?';
        params.push(data.amount)
    }
    if (data.image) {
        updatePart += ', image = ?';
        params.push(data.image)
    }
    let conditionPart = ' where id = ?;';
    params.push(itemId)
    let sql = updatePart + conditionPart
    const result = await dbUtil.queryOne(sql, params);
    return result;
}

export const deleteItemDAL = async (itemId) => {
    let sql = 'update item set deleted = 1 where id = ?';
    const result = await dbUtil.query(sql, [itemId]);
    return result;
}