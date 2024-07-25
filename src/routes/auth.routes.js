import { Router } from 'express';
import { createUser, userLogin } from '../controller/auth.controller.js';

const router = Router();

router.post('/create', createUser);
router.post('/login', userLogin)

export default router