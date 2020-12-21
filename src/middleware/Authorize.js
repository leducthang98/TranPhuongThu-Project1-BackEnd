import { ERRORS } from "../constant/Errors";

export const requireAdmin = async (req, res, next) => {
    console.log('?')
    const crediental = req.tokenDecoded;
    if (crediental?.role === 'ADMIN') {
        next();
    } else {
        next(ERRORS.TOKEN_NOT_ALLOWED);
    }
}