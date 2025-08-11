const express = require('express');
const router = express.Router();
const DispositivoController = require('../controllers/DispositivoController');
const autentificaJWT = require('../../middleware/auntentificaJWT'); // Middleware para autenticar JWT

// Rutas para el controlador de Dispositivo
router.post('/', autentificaJWT ,DispositivoController.create); // Crear un nuevo material en un estante del dispositivo 
router.get('/:id', DispositivoController.getDispositivoById); // Obtener un dispositivo por ID
router.get('/', DispositivoController.getAllDispositivos); // Obtener todos los dispositivos
router.put('/:id', DispositivoController.updateDispositivoById); // Actualizar un dispositivo por ID
router.delete('/:id', DispositivoController.deleteDispositivoById); // Eliminar un dispositivo por ID
router.get('/led/:celda', DispositivoController.getLedByCelda); // Obtener el estado del LED por celda
router.put('/led/:celda', DispositivoController.updateLedByCelda); // Actualizar el estado del LED por celda


module.exports = router; // Exportar el enrutador para usarlo en otros archivos
