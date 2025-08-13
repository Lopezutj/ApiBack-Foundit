const express = require('express');
const router = express.Router();
const DispositivoController = require('../controllers/DispositivoController');
const autentificaJWT = require('../../middleware/auntentificaJWT'); // Middleware para autenticar JWT

// Rutas para el controlador de Dispositivo
router.post('/', autentificaJWT ,DispositivoController.create); // Crear un nuevo material en un estante del dispositivo 

// Endpoints para el ESP32
// El ESP32 envía datos de temperatura y humedad por POST
router.post('/api/dht', DispositivoController.receiveDHT); // ESP32 → Node.js (guarda datos DHT)
// El ESP32 consulta el estado actual del LED por GET
router.get('/api/led/status', DispositivoController.getLedStatus); // ESP32 ← Node.js (lee estado LED)
// El ESP32 consulta la posición actual del servo por GET
router.get('/api/servo/status', DispositivoController.getServoStatus); // ESP32 ← Node.js (lee posición servo)

// Endpoints para el frontend (Laravel)
// El dashboard web envía comandos para controlar el LED por POST
router.post('/api/led/control', DispositivoController.controlLed); // Web → Node.js (cambia estado LED)
// El dashboard web envía comandos para controlar el servo por POST
router.post('/api/servo/control', DispositivoController.controlServo); // Web → Node.js (cambia posición servo)
// El dashboard web consulta los últimos datos de temperatura y humedad por GET
router.get('/api/dht', DispositivoController.getLatestDHT); // Web ← Node.js (lee datos DHT)

module.exports = router; // Exportar el enrutador para usarlo en otros archivos
