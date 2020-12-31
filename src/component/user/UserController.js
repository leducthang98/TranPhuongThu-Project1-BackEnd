import { commonResponse } from "../../util/ResponseForm";
import { getUserByUserId, updateUserByUserId } from "./UserDAL";

export const getMe = async (req, res, next) => {
    const { tokenDecoded } = req
    let userId = tokenDecoded.userId;
    const result = await getUserByUserId(userId);
    res.send(commonResponse(result))
}

export const updateMe = async (req, res, next) => {
    const { tokenDecoded } = req
    const dataUpdate = req.body;
    let userId = tokenDecoded.userId;
    console.log('aaa', dataUpdate)
    const result = await updateUserByUserId(userId, dataUpdate);
    res.send(commonResponse(result))
}