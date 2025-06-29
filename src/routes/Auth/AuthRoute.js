const express = require('express');
const LoginController = require('../../controllers/Auth/LoginController');
const router = express.Router();



router.post('/',LoginController.login); // Ruta para iniciar sesión

module.exports = router; // Exportar el enrutador para usarlo en otros archivos