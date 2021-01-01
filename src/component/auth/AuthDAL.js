import * as dbUtil from '../../util/DatabaseUtil';

export const getUserByUsername = async (username, password) => {
    const sql = 'select * from account where username = ?';
    const result = await dbUtil.queryOne(sql, [username, password]);
    return result;
}

export const createNewAccount = async (username, password, email) => {
    let userRole = 'user';
    const sql = 'insert into account (username, password, email, role ) values (?, ?, ?, ?)';
    const result = await dbUtil.query(sql, [username, password, email, userRole]);
    return result;
}