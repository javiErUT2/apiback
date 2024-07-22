import { Router } from 'express';
import { sendMessage } from '../controller/send.controller.js';

const router = Router();

router.post('/', sendMessage);

export default router