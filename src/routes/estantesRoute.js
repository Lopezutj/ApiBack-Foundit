const express = require('express');
const router = express.Router();
const EstanteController = require('../controllers/EstanteController');
const autentificaJWT = require('../../middleware/auntentificaJWT'); // Importar el middleware de autenticación

//rutas para el controlador de estantes
router.post('/',autentificaJWT,EstanteController.create); // Ruta para crear un estante
router.get('/all',autentificaJWT,EstanteController.getAllEstantes)


module.exports = router; // Exportar el enrutador para usarlo en otros archivos