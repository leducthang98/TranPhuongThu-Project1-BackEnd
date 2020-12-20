import { Router } from 'express';
import { jwtFilter } from '../../middleware/Authenticate';
import { controllerHandler } from '../../middleware/ErrorHandler';
import * as bcryptUtil from '../../util/BcryptUtil';
import { createItem, getAllItem } from './ItemController';
const path = '/item';
const router = Router();

router.post('/create', jwtFilter, controllerHandler(createItem));

router.get('/all', jwtFilter, controllerHandler(getAllItem));

export default { path, router };
