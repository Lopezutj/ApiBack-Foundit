const express = require('express');
const router = express.Router();
const DispositivoController = require('../controllers/DispositivoController');

//rutas para el controlador de dispositivos
router.post('/', DispositivoController.create);
router.get('/:id', DispositivoController.getDispositivoById);
router.get('/', DispositivoController.getAllDispositivos);
router.put('/:id', DispositivoController.updateDispositivoById);
router.delete('/:id', DispositivoController.deleteDispositivoById);