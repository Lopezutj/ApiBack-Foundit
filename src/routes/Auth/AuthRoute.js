const express = require('express');
const LoginController = require('../../controllers/Auth/LoginController');
const router = express.Router();

router.post('/', LoginController.login); // Ruta para iniciar sesión
router.post('/validate-token', LoginController.validateToken); // Ruta para validar token
router.get('/validate-token', LoginController.validateToken); // También disponible como GET

module.exports = router; // Exportar el enrutador para usarlo en otros archivos