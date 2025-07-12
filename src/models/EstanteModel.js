const mongoose = require('mongoose');
const DispositivoModel = require('./DispositivoModel'); // importar el modelo de Dispositivo

const EstanteSchema = new mongoose.Schema({
    nombre:{
        type: String,
        required: true,
    },
    casillas:{
        type: Number,
        required: true,
    },
    fechaCreacion:{
        type: Date,
        default: Date.now,
    },
    dispositivo: [DispositivoModel.schema], // Usar el esquema del modelo Dispositivo

});

module.exports = mongoose.model('Estante', EstanteSchema);