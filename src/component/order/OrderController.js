import { ERRORS } from "../../constant/Errors";
import { commonResponse } from "../../util/ResponseForm";
import { cancelOrderDAL, createOrderWithItemDAL, getMyOrdersDAL } from "./OrderDAL";

export const createOrderWithItem = async (req, res, next) => {
    const { tokenDecoded } = req
    let userId = tokenDecoded.userId;
    let items = req.body;
    const result = await createOrderWithItemDAL(userId, items);
    res.send(commonResponse({
        orderCreated: {
            id: result,
            itemsId: items
        }
    }))
}

export const getMyOrders = async (req, res, next) => {
    const { tokenDecoded } = req
    let userId = tokenDecoded.userId;
    const result = await getMyOrdersDAL(userId);
    res.send(commonResponse(result))
}

export const cancelOrder = async (req, res, next) => {
    const response = await cancelOrderDAL(req.params.orderId);
    res.send(commonResponse({
        orderCanceledId: req.params.orderId
    }))
}