import { Router } from 'express';
import { jwtFilter } from '../../middleware/Authenticate';
import { requireAdmin } from '../../middleware/Authorize';
import { controllerHandler } from '../../middleware/ErrorHandler';
import * as bcryptUtil from '../../util/BcryptUtil';
import { cancelOrder, createOrderWithItem, executeOrder, getAllOrder, getMyOrders, getOrderDetail } from './OrderController';

const path = '/order';
const router = Router();

router.post('/create', jwtFilter, controllerHandler(createOrderWithItem));

router.get('/me', jwtFilter, controllerHandler(getMyOrders));

router.put('/cancel/:orderId', jwtFilter, controllerHandler(cancelOrder));

router.get('/all', jwtFilter, requireAdmin, controllerHandler(getAllOrder));

router.put('/executeOrder', jwtFilter, requireAdmin, controllerHandler(executeOrder));

router.get('/:orderId', jwtFilter, requireAdmin, controllerHandler(getOrderDetail));

export default { path, router };
