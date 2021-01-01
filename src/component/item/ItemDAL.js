import * as dbUtil from '../../util/DatabaseUtil';

export const createItemDAL = async (item) => {
    let sql = 'insert into item (name, type, price, description, amount, image) values (?, ?, ?, ?, ?, ?)';
    const result = await dbUtil.query(sql, [item.name, item.type, item.price, item.description, item.amount, item.image]);
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

    let sql = 'select * from item where 1 = 1';
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