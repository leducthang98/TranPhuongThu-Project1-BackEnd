import { Router } from 'express';

import { controllerHandler } from '../../middleware/ErrorHandler';
import { login, register } from './AuthController';

const path = '/auth';
const router = Router();

router.post('/login', controllerHandler(login));

router.post('/regist', controllerHandler(register));

export default { path, router };
