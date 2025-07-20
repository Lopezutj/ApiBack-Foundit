const express = require('express');
const router = express.Router(); // Crear un enrutador de Express
const MaterialesController = require('../controllers/MaterialController');
const autentificaJWT = require('../../middleware/auntentificaJWT');


// Rutas para el controlador de Materiales
router.post('/',autentificaJWT, MaterialesController.create); // Crear un nuevo material usuario tipo admin y operador
router.get('/:id', MaterialesController.getMaterialById); // Obtener un material por ID
router.get('/', MaterialesController.getMaterialByNombre); // Obtener materiales por nombre
router.put('/:id', MaterialesController.updateMaterialById); // Actualizar un material por ID
router.delete('/:id', MaterialesController.deleteMaterialById); // Eliminar un material por ID

module.exports = router; // Exportar el enrutador para usarlo en otros archivos
