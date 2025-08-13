const mongoose = require('mongoose');
const MaterialModel = require('./MaterialModel'); // Importar el modelo de Material

const DispositivoSchema = new mongoose.Schema({
    celda: { // Nombre de la celda del dispositivo
        type: Number,
        required: false,
    },
    temperature: {
        type: Number,
        required: false
    },
    humidity: {
        type: Number,
        required: false
    },
    led: {
        ledId: { type: Number, default: -1 },
        state: { type: String, default: 'off' }
    },
    servo: {
        position: { type: Number, default: 0 }
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    materiales: [MaterialModel.schema], // Array de materiales embebidos

});

module.exports = mongoose.model('Dispositivo', DispositivoSchema); // Exportar el modelo de dispositivo