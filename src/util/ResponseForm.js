import { STATUS } from "../constant/StatusCode"

export const commonResponse = (pureResponse = null, code = STATUS.OK.CODE, message = STATUS.OK.MESSAGE) => {
    return {
        code: code,
        message: message,
        data: pureResponse
    }
}