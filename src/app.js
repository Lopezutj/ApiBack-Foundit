const express = require('express'); // Importar el framework express
const env = require('dotenv');// Importar dotenv para manejar variables de entorno
env.config();
const cors = require('cors'); // Importar cors para manejar CORS
const morgan = require('morgan');  // Importar morgan para registrar las solicitudes HTTP
const mongoose = require('mongoose'); // Importar mongoose para manejar la base de datos MongoDB

// Conectar a la base de datos MongoDB
const connectDB = require('./config/db');
connectDB();
  
// Importar las rutas
const authRoute = require('./routes/Auth/AuthRoute');
const autentificaJWT = require('../middleware/auntentificaJWT'); // Middleware para autenticar JWT
const userRoute = require('./routes/usersRoute');
const deviceRoute = require('./routes/dispositivosRoute');
const materialRoute = require('./routes/materialesRoute');
const almacenRoute = require('./routes/almacenesRoute');
const estanteRoute = require('./routes/estantesRoute');

var app = express();

// Middlewares de la aplicación de Express
app.use(cors({
  origin: '*',
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));


app.use(morgan('dev')); // Registrar las solicitudes HTTP en la consola
app.use(express.json()); // Analizar el cuerpo de las solicitudes JSON
app.use(express.urlencoded({ extended: true })); // Analizar el cuerpo de las solicitudes URL-encoded

// Configurar las rutas
app.use('/login', authRoute); // Ruta para autenticación
app.use('/users', userRoute);
app.use('/dispositivos', deviceRoute);
app.use('/materiales', materialRoute);
app.use('/almacenes', almacenRoute);
app.use('/estantes', estanteRoute);


// Manejo de rutas no encontradas (404)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: 'Error interno del servidor',
    message: err.message || 'Ocurrió un error inesperado'
  });
});

module.exports = app;