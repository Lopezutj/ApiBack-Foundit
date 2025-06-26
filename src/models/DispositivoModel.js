const mongoose = require('mongoose');

const DisposiitvoSchema = new mongoose.Schema({
    nombre:{
        type: String,
        required: true,
    },
    direccionIp:{
        type: String,
        required: true,
        unique: true,
    },
    estado:{
        type: String,
        required: true,
    },
    fechaCreacion:{
        type: Date,
        default: Date.now,
    },
    leds:{
        type:Number,
        required: true
    }
    
});
module.exports = mongoose.model('Dispositivo', DisposiitvoSchema);