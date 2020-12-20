import { ERRORS } from "../../constant/Errors";
import { commonResponse } from "../../util/ResponseForm";
import { createItemDAL, getAllItemDAL } from './ItemDAL';
export const createItem = async (req, res, next) => {
    let data = req.body;
    if (data.name && data.type) {
        await createItemDAL(data);
        res.status(200).send(commonResponse(data))
    } else {
        next(ERRORS.INVALID_INPUT_PARAMS);
    }
}

export const getAllItem = async (req, res, next) => {
    const result = await getAllItemDAL();
    res.status(200).send(commonResponse(result))
}
