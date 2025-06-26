const express = require('express');
const router = express.Router();
const EstanteController = require('../controllers/EstanteController');

//rutas para el controlador de estantes
router.post('/', EstanteController.create);
router.get('/:id', EstanteController.getEstanteById);
router.get('/', EstanteController.getAllEstantes);
router.put('/:id', EstanteController.updateEstanteById);
router.delete('/:id', EstanteController.deleteEstanteById);
