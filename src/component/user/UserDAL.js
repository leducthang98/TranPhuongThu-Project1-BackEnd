import * as dbUtil from '../../util/DatabaseUtil';

export const getUserByUserId = async (userId) => {
    let sql = 'select id, username, email, age, gender, image from account where id = ?';
    const result = await dbUtil.queryOne(sql, [userId]);
    return result;
}