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