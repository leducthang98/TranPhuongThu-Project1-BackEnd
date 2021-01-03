import { Router } from 'express';
import { jwtFilter } from '../../middleware/Authenticate';
import { requireAdmin } from '../../middleware/Authorize';
import { controllerHandler } from '../../middleware/ErrorHandler';
import * as bcryptUtil from '../../util/BcryptUtil';
import { createNews, deleteNews, getAllNews, increaseView, searchNews } from './NewsController';

const path = '/news';
const router = Router();

router.get('/all', jwtFilter, controllerHandler(getAllNews));

router.put('/increaseView/:id', jwtFilter, controllerHandler(increaseView));

router.get('/search', jwtFilter, controllerHandler(searchNews));

router.delete('/:id', jwtFilter, controllerHandler(deleteNews));

router.post('/create', jwtFilter, controllerHandler(createNews));

export default { path, router };
