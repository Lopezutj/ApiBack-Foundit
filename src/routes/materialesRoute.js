const express = require('express');
const router = express.Router(); // Crear un enrutador de Express
const MaterialesController = require('../controllers/MaterialController');
const autentificaJWT = require('../../middleware/auntentificaJWT');


// Rutas para el controlador de Materiales
router.post('/',autentificaJWT, MaterialesController.create); // Crear un nuevo material usuario tipo admin y operador
router.get('/all', autentificaJWT, MaterialesController.getAllMateriales); // Obtener todos los materiales para apk
router.get('/allWEB',autentificaJWT, MaterialesController.AllMatariales); // Obtener todos los materiales para web
router.get('/name/:name', autentificaJWT, MaterialesController.getMaterialByNombre); // Obtener materiales por nombre con parámetro de ruta
router.put('/:id', autentificaJWT, MaterialesController.updateMaterialById); // Actualizar un material por ID
router.delete('/:id', autentificaJWT, MaterialesController.deleteMaterialById); // Eliminar un material por ID

module.exports = router; // Exportar el enrutador para usarlo en otros archivos
