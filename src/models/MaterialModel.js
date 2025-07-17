const mongoose = require('mongoose');//
const DispositivoModel = require('./DispositivoModel'); // importar el modelo de Dispositivo

//Schema de Material
const MaterialSchema =  new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    cantidad: {
        type: Number,
        required: true,
    },
    ubicacion: {
        type: String,
        required: true,
    },
    movimientos: {
        type: [String], // arreglo simple de strings
        default: []
    },
    Timestamp:{
        type: Date,
        default: Date.now, // Establecer la fecha y hora actual como valor por defecto
    }
});

module.exports =  mongoose.model('Material',MaterialSchema);//exporta el modelo 