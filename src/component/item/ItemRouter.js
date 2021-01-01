import { Router } from 'express';
import { jwtFilter } from '../../middleware/Authenticate';
import { requireAdmin } from '../../middleware/Authorize';
import { controllerHandler } from '../../middleware/ErrorHandler';
import * as bcryptUtil from '../../util/BcryptUtil';
import { createItem, deleteItem, getAllItem, getItemById, searchItem, updateItem } from './ItemController';
const path = '/item';
const router = Router();

router.post('/create', jwtFilter, requireAdmin, controllerHandler(createItem));

router.get('/all', jwtFilter, controllerHandler(getAllItem)); // query: column, sort, type

router.get('/search', jwtFilter, controllerHandler(searchItem));

router.get('/:id', jwtFilter, controllerHandler(getItemById));

router.put('/:itemId', jwtFilter, requireAdmin, controllerHandler(updateItem));

router.delete('/:itemId', jwtFilter, requireAdmin, controllerHandler(deleteItem));

export default { path, router };
