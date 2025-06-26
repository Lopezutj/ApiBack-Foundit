const mongoose =  require('mongoose'); // importar mongoose para definir el esquema del modelo


const AlmacenSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    direccion: {
        type: String,
        required: true,
    },
    capacidadEstantes: {
        type: Number,
        required: true,
    },
    
});

module.exports = mongoose.model('Almacen', AlmacenSchema); // Exportar el modelo de almacen
// Este modelo define la estructura de los documentos de almacén en la base de datos MongoDB