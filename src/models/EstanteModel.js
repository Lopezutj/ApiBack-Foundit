const mongoose = require('mongoose');

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
    }
});

module.exports = mongoose.model('Estante', EstanteSchema);