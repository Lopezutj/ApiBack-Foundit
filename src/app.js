const express = require('express'); // Importar el framework express
const cors =require('cors'); // Importar el middleware cors
const morgan = require('morgan'); // Importar el middleware morgan para logging

// Importar las rutas
const pruebaRoute = require('./routes/prueba'); // Importar la ruta de prueba
const userRoute = require('./routes/users'); // Importar la ruta de usuarios


//inicializar la app
var app = express();

//Midlewares
app.use(cors()); //habilitar CORS para todas las rutas
app.use(morgan('dev')); // Usar morgan para logging de peticiones HTTP
app.use(express.json()); //soportar JSON en las peticiones
app.use(express.urlencoded({ extended: false })); //soportar datos codificados en URL


// Configurar las rutas
app.use('/',pruebaRoute);
app.use('/users',userRoute); // Ruta para usuarios


//configuarcion de cors
app.use(cors({
  origin : '*', // * Permitir todas las solicitudes de origen //'http://localhost:4200', -- URL del frontend angular
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'], // Métodos permitidos
  preflightContinue: false, // No continuar con la solicitud siguiente
  optionsSuccessStatus: 204 // Código de estado para respuestas exitosas de preflight
}));

//Manejo de rutas no encontradas (404)
app.use((req,res,next)=>{
  res.status(404).json({error: 'Ruta no encontrada'});
});

//Manejo de errores Genrales
app.use((err,req,res,next)=>{
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: 'Error interno del servidor',
    message: err.message || 'Ocurrió un error inesperado'
  });
});

module.exports = app;
