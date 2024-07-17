// rutas.js

const express = require('express');
const router = express.Router();
const apicontroller = require('../controller/apicontroller');
const facebookController = require('../controller/MandarController'); // Asegúrate de que la ruta al controlador sea correcta

// Rutas existentes
router.get('/', apicontroller.verificar);
router.post('/', apicontroller.recibir);

// Ruta para enviar mensaje a través de la API de Facebook Graph
router.post('/send-message', facebookController.sendMessage);

module.exports = router;
