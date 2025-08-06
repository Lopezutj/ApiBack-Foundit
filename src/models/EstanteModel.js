const mongoose = require('mongoose');
const DispositivoModel = require('./DispositivoModel'); // Importar el modelo de Dispositivo

const EstanteSchema = new mongoose.Schema({
    nombre:{ //nombre del estante
        type: String,
        required: true,
    },
    nameDispositivo: { //nombre del dispositivo asociado al estante
        type: String,
        required: true,
    },
    ip: { // dirección IP del dispositivo asociado al estante
        type: String,
        required: true,
    },
    dispositivos: [DispositivoModel.schema] // Array de dispositivos embebidos

});

module.exports = mongoose.model('Estante', EstanteSchema);