const express = require('express');// Importar el framework express
const router = express.Router(); // Crear un enrutador de Express
const AlmacenController = require('../controllers/AlmacenController'); // Importar el controlador de almacenes



// Rutas para el controlador de almacenes
router.post('/', AlmacenController.create); // Ruta para crear un nuevo almacén
router.get('/:id', AlmacenController.getAlmacenById); // Ruta para obtener un almacén por ID
router.get('/', AlmacenController.getAlmacenByDireccion); // Ruta para obtener almacenes por dirección
router.put('/:id', AlmacenController.updateAlmacenById); // Ruta para actualizar un almacén por ID
router.delete('/:id', AlmacenController.deleteAlmacenById); // Ruta para eliminar un almacén por ID