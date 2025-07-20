const express = require('express');
const router = express.Router(); 
const AlmacenController = require('../controllers/AlmacenController');
const autentificaJWT = require('../../middleware/auntentificaJWT'); // Importar el middleware de autenticación

// Rutas para el controlador de Almacen
router.post('/',autentificaJWT, AlmacenController.create); // Crear un nuevo almacén (requiere autenticación) solo admin
router.get('/all',autentificaJWT,AlmacenController.getALmacenAll); // Obtener todos los almacenes 
router.get('/name/:name', autentificaJWT, AlmacenController.getAlmacenName); // Obtener un almacén por name
router.put('/id/:id', autentificaJWT, AlmacenController.updateAlmacenById); // Actualizar un almacén por ID solo admin
router.delete('/id/:id', autentificaJWT, AlmacenController.deleteAlmacenById); // Eliminar un almacén por ID  solo admin


module.exports = router; // Exportar el enrutador para usarlo en otros archivos