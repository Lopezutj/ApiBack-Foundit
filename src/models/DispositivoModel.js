const mongoose = require('mongoose');
const MaterialModel = require('./MaterialModel'); // Importar el modelo de Material

const DispositivoSchema = new mongoose.Schema({
    celda: { // Nombre de la celda del dispositivo
        type: Number,
        required: false,
    },
    material: MaterialModel.schema, // Material embebido (singular, no array)

});

module.exports = mongoose.model('Dispositivo', DispositivoSchema); // Exportar el modelo de dispositivo