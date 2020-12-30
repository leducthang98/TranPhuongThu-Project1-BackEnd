import { commonResponse } from "../../util/ResponseForm";
import { getUserByUserId } from "./UserDAL";

export const getMe = async (req, res, next) => {
    const { tokenDecoded } = req
    let userId = tokenDecoded.userId;
    const result = await getUserByUserId(userId);
    res.send(commonResponse(result))
}