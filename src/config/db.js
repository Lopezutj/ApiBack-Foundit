const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config(); // Cargar las variables de entorno desde el archivo .env

// Conexión a la base de datos MongoDB
    const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        nombredb = mongoose.connection.name; // Obtener el nombre de la base de datos 
        console.log(`Conectado a la base de datos MongoDB: ${nombredb}`);
        console.log('Running Server and Endpoints');
    } catch (err) {
        console.error('Error al conectar a la base de datos MongoDB:', err);
        process.exit(1); // Detener la app si falla la conexión
    }
    };

module.exports = connectDB;