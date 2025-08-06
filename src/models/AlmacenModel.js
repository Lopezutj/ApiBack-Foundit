const mongoose =  require('mongoose'); // importar mongoose para definir el esquema del modelo
const EstanteModel = require('./EstanteModel'); // importar el modelo de Estante
const MaterialModel = require('./MaterialModel'); // importar el modelo de Material


const AlmacenSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    direccion: {
        type: String,
        required: true,
    },
    Timestamp:{
        type: Date,
        default: Date.now, // Establecer la fecha y hora actual como valor por defecto
    },
    estantes: [EstanteModel.schema], // Array de estantes embebidos
    
});

module.exports = mongoose.model('Almacen', AlmacenSchema); // Exportar el modelo de almacen
// Este modelo define la estructura de los documentos de almacén en la base de datos MongoDB