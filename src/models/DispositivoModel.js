const mongoose = require('mongoose');

const DispositivoSchema = new mongoose.Schema({
    nombre:{
        type: String,
        required: true,
    },
    direccionIp:{
        type: String,
        required: true,
    },
    estado:{
        type: String,
        required: true,
    },
    leds:{
        type: [Number], // Array de números para almacenar los estados de los LEDs
        default: [], // Valor por defecto es un array vacío
        required: true
    },
    fechaCreacion:{
        type: Date, // Tipo de dato Date para almacenar la fecha y hora
        default: Date.now, // Establecer la fecha y hora actual como valor por defecto
    }

});

module.exports = mongoose.model('Dispositivo', DispositivoSchema); // Exportar el modelo de dispositivo