import * as dbUtil from '../../util/DatabaseUtil';
import moment from 'moment';

export const getAllNewsDAL = async () => {
    let sql = 'Select * from news where deleted = 0';
    const response = await dbUtil.query(sql, []);
    return response;
}

export const increaseViewDAL = async (id) => {
    let sql = 'update news set view = view + 1 where id = ?';
    const response = await dbUtil.query(sql, [id]);
    return response;
}

export const searchNewsDAL = async (searchData) => {
    let sql = 'select * from news where deleted = 0';
    let params = []
    if (searchData) {
        sql += ' and lower(title) like ?';
        params.push('%' + searchData.toLowerCase() + '%');
    }
    const result = await dbUtil.query(sql, params);
    return result;
}

export const deleteNewsDAL = async (newsId) => {
    let sql = 'update news set deleted = 1 where id = ?';
    const response = await dbUtil.query(sql, [newsId]);
    return response;
}

export const createNewsDAL = async (data) => {
    let params = []
    if (data.title) {
        params.push(data.title)
    } else {
        params.push(null)
    }
    if (data.content) {
        params.push(data.content)
    } else {
        params.push(null)
    }
    if (data.image) {
        params.push(data.image)
    } else {
        params.push(null)
    }
    let timestamp = moment().format('YYYY-MM-DD hh:mm:ss');
    params.push(timestamp);

    let sql = 'insert into news (title,content,image,view,created_time,deleted) values (?,?,?,0,?,0)';

    const result = await dbUtil.query(sql, params);
    return result;
}

