import { ERRORS } from "../../constant/Errors";
import { commonResponse } from "../../util/ResponseForm";
import { createNewsDAL, deleteNewsDAL, getAllNewsDAL, increaseViewDAL, searchNewsDAL } from "./NewsDAL";


export const getAllNews = async (req, res, next) => {
    const response = await getAllNewsDAL();
    res.send(commonResponse(response));
}

export const increaseView = async (req, res, next) => {
    const response = await increaseViewDAL(req.params.id);
    res.send(commonResponse({
        newsId: req.params.id,
        increase: 1
    }));
}

export const searchNews = async (req, res, next) => {
    const response = await searchNewsDAL(req?.query?.searchData);
    res.send(commonResponse(response));
}


export const deleteNews = async (req, res, next) => {
    const response = await deleteNewsDAL(req?.params?.id);
    res.send(commonResponse({
        deletedNewsId: req?.params?.id
    }));
}

export const createNews = async (req, res, next) => {
    const response = await createNewsDAL(req.body);
    res.send(commonResponse(response));
}