import { ERRORS } from "../../constant/Errors";
import { commonResponse } from "../../util/ResponseForm";
import { createItemDAL, deleteItemDAL, getAllItemDAL, getItemByIdDAL, searchItemDAL, updateItemDAL } from './ItemDAL';

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
    const result = await getAllItemDAL(req);
    res.status(200).send(commonResponse(result))
}

export const getItemById = async (req, res, next) => {
    const { id } = req.params
    const result = await getItemByIdDAL(id);
    res.status(200).send(commonResponse(result))
}

export const searchItem = async (req, res, next) => {
    const result = await searchItemDAL(req?.query?.searchData, req?.query?.type);
    res.status(200).send(commonResponse(result))
}

export const updateItem = async (req, res, next) => {
    const result = await updateItemDAL(req?.params?.itemId, req?.body);
    res.status(200).send(commonResponse({
        itemId: req?.params?.itemId,
        updatedData: req?.body
    }))
}

export const deleteItem = async (req, res, next) => {
    const result = await deleteItemDAL(req?.params?.itemId);
    res.status(200).send(commonResponse({
        deletedItemId: req?.params?.itemId,
    }))
}