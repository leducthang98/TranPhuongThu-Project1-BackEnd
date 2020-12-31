import { Router } from 'express';
import { jwtFilter } from '../../middleware/Authenticate';
import { controllerHandler } from '../../middleware/ErrorHandler';
import { getMe, updateMe } from './UserController';

const path = '/user';
const router = Router();

router.get('/me', jwtFilter, controllerHandler(getMe));

router.put('/update/me', jwtFilter, controllerHandler(updateMe));


export default { path, router };
