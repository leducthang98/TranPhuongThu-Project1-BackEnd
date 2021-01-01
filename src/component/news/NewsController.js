import { ERRORS } from "../../constant/Errors";
import { commonResponse } from "../../util/ResponseForm";
import { getAllNewsDAL, increaseViewDAL } from "./NewsDAL";


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