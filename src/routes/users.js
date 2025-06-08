var express = require('express');
var router = express.Router();
const {registerUser,getAllOpertiveUsers} = require('../controllers/user.controller'); // Importar el controlador de usuario 

router.get('/',getAllOpertiveUsers); // Ruta para obtener todos los usuarios operativos
router.post('/register',registerUser); // Ruta para registrar un nuevo usuario

module.exports = router;
