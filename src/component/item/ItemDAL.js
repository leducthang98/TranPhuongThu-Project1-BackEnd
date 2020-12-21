import * as dbUtil from '../../util/DatabaseUtil';

export const createItemDAL = async (item) => {
    let sql = 'insert into item (name, type, price, description, amount, image) values (?, ?, ?, ?, ?, ?)';
    const result = await dbUtil.query(sql, [item.name, item.type, item.price, item.description, item.amount, item.image]);
    return result;
}

export const getAllItemDAL = async () => {
    let sql = 'select * from item';
    const result = await dbUtil.query(sql, []);
    return result;
}

export const getItemByIdDAL = async (id) => {
    let sql = 'select * from item where id = ?';
    const result = await dbUtil.queryOne(sql, [id])
    return result;
}