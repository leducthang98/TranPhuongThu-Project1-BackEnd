import { Router } from 'express';
import { jwtFilter } from '../../middleware/Authenticate';
import { requireAdmin } from '../../middleware/Authorize';
import { controllerHandler } from '../../middleware/ErrorHandler';
import * as bcryptUtil from '../../util/BcryptUtil';
import { getAllNews, increaseView, searchNews } from './NewsController';

const path = '/news';
const router = Router();

router.get('/all', jwtFilter, controllerHandler(getAllNews));

router.get('/increaseView/:id', jwtFilter, controllerHandler(increaseView));

router.get('/search', jwtFilter, controllerHandler(searchNews));

export default { path, router };
