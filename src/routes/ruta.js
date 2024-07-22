// rutas.js

import { Router } from 'express';
const router = Router();

import { verificar, recibir } from '../controller/apicontroller.js';
import { sendMessage } from '../controller/send.controller.js';

// Rutas existentes
router.get('/', verificar);
router.post('/', recibir);

// Ruta para enviar mensaje a través de la API de Facebook Graph
router.post('/send-message', sendMessage);

export default router;
