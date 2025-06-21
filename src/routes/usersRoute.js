const express = require('express'); // Importar el framework express
const router = express.Router(); // Crear un enrutador de Express
const UserController = require('../controllers/UserController'); // Importar el controlador de usuarios

router.post('/', UserController.create); // Ruta para crear un usuario
router.get('/', UserController.getAllUsers); // Ruta para obtener todos los usuarios
router.get('/:id', UserController.getUserbyId); // Ruta para obtener un usuario por ID
router.put('/:id', UserController.updateUser); // Ruta para actualizar un usuario por ID
router.delete('/:id', UserController.deleteUser); // Ruta para eliminar un usuario por ID
router.post('/login', UserController.login); // Ruta para iniciar sesión

module.exports = router;
