import { Router } from 'express';
import { jwtFilter } from '../../middleware/Authenticate';
import { controllerHandler } from '../../middleware/ErrorHandler';
import { getMe } from './UserController';

const path = '/user';
const router = Router();

router.get('/me', jwtFilter, controllerHandler(getMe));


export default { path, router };
