const express = require('express');
const router = express.Router(); 
const AlmacenController = require('../controllers/AlmacenController');
const autentificaJWT = require('../../middleware/auntentificaJWT'); // Importar el middleware de autenticación

// Rutas para el controlador de Almacen
router.post('/', autentificaJWT, AlmacenController.create); // Crear un nuevo almacén (requiere autenticación)
router.get('/:id', autentificaJWT, AlmacenController.getAlmacenById); // Obtener un almacén por ID
router.get('/', autentificaJWT, AlmacenController.getAlmacenByDireccion); // Obtener almacenes por dirección
router.put('/:id', autentificaJWT, AlmacenController.updateAlmacenById); // Actualizar un almacén por ID
router.delete('/:id', autentificaJWT, AlmacenController.deleteAlmacenById); // Eliminar un almacén por ID 

module.exports = router; // Exportar el enrutador para usarlo en otros archivos