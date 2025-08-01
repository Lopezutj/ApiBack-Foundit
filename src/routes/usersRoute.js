const express = require('express'); // Importar el framework express
const router = express.Router(); // Crear un enrutador de Express
const UserController = require('../controllers/UserController'); // Importar el controlador de usuarios
const autentificaJWT = require('../../middleware/auntentificaJWT');

//Estas endpoints son puede manejar el administrador y el usuario autenticado

router.post('/', UserController.create); // Ruta para crear un usuario sin verificación
router.get('/',autentificaJWT, UserController.getAllUsers); // Ruta para obtener todos los usuarios solo 
router.get('/name/:name',autentificaJWT,UserController.getUserbyname); // Ruta para obtener un usuario por nombre
router.get('/id/:id',autentificaJWT, UserController.getUserbyId); // Ruta para obtener un usuario por ID
router.put('/id/:id',autentificaJWT, UserController.updateUser); // Ruta para actualizar un usuario por ID
router.delete('/:id',autentificaJWT, UserController.deleteUser); // Ruta para eliminar un usuario por ID

module.exports = router;
