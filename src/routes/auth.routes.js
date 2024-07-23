import { Router } from 'express';
import { createUser } from '../controller/auth.controller.js';

const router = Router();

router.post('/create', createUser);

export default router