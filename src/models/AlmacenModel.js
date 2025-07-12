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
    estantes: [EstanteModel.schema], // Usar el esquema del modelo Estante
    materiales: [MaterialModel.schema], // Usar el esquema del modelo Material
    
    

});

module.exports = mongoose.model('Almacen', AlmacenSchema); // Exportar el modelo de almacen
// Este modelo define la estructura de los documentos de almacén en la base de datos MongoDB