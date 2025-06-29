const express = require('express');
const router = express.Router(); 
const AlmacenController = require('../controllers/AlmacenController');

// Rutas para el controlador de Almacen
router.post('/', AlmacenController.create); // Crear un nuevo almacén
router.get('/:id', AlmacenController.getAlmacenById); // Obtener un almacén por ID
router.get('/', AlmacenController.getAlmacenByDireccion); // Obtener almacenes por dirección<
router.put('/:id', AlmacenController.updateAlmacenById); // Actualizar un almacén por ID
router.delete('/:id', AlmacenController.deleteAlmacenById); // Eliminar un almacén por ID 

module.exports = router; // Exportar el enrutador para usarlo en otros archivos