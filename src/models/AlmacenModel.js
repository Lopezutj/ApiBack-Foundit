const mongoose =  require('mongoose'); // importar mongoose para definir el esquema del modelo
const EstanteSchema = require('./EstanteModel'); // importar el modelo de Estante


const AlmacenSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    direccion: {
        type: String,
        required: true,
    },
    estantes: [EstanteSchema], // Relación con el modelo Estante
    
    

});

module.exports = mongoose.model('Almacen', AlmacenSchema); // Exportar el modelo de almacen
// Este modelo define la estructura de los documentos de almacén en la base de datos MongoDB