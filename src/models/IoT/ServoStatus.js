const mongoose = require('mongoose');

const ServoStatusSchema = new mongoose.Schema({
  angulo: { type: Number, required: true }, // Ángulo del servo (0 cerrado,180 abierto) 
  Timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ServoStatus', ServoStatusSchema);