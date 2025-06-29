const express = require('express');
const router = express.Router();
const DispositivoController = require('../controllers/DispositivoController');

// Rutas para el controlador de Dispositivo
router.post('/', DispositivoController.create); // Crear un nuevo dispositivo
router.get('/:id', DispositivoController.getDispositivoById); // Obtener un dispositivo por ID
router.get('/', DispositivoController.getAllDispositivos); // Obtener todos los dispositivos
router.put('/:id', DispositivoController.updateDispositivoById); // Actualizar un dispositivo por ID
router.delete('/:id', DispositivoController.deleteDispositivoById); // Eliminar un dispositivo por ID

module.exports = router; // Exportar el enrutador para usarlo en otros archivos