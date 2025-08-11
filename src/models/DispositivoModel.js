const mongoose = require('mongoose');
const MaterialModel = require('./MaterialModel'); // Importar el modelo de Material

const DispositivoSchema = new mongoose.Schema({
    celda: { type: Number, required: true }, // ID del LED (0-11)
    led: { type: Boolean, required: true }, // Estado del LED (true/false)
    
    materiales: [MaterialModel.schema], // Array de materiales embebidos

});

module.exports = mongoose.model('Dispositivo', DispositivoSchema); // Exportar el modelo de dispositivo