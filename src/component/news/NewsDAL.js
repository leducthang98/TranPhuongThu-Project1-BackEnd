import * as dbUtil from '../../util/DatabaseUtil';

export const getAllNewsDAL = async () => {
    let sql = 'Select * from news';
    const response = await dbUtil.query(sql, []);
    return response;
}

export const increaseViewDAL = async (id) => {
    let sql = 'update news set view = view + 1 where id = ?';
    const response = await dbUtil.query(sql, [id]);
    return response;
}

export const searchNewsDAL = async (searchData) => {
    let sql = 'select * from news where 1 = 1';
    let params = []
    if (searchData) {
        sql += ' and lower(title) like ?';
        params.push('%' + searchData.toLowerCase() + '%');
    }
    const result = await dbUtil.query(sql, params);
    return result;
}