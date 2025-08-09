const mongoose = require("mongoose");

const ledStatusSchema = new mongoose.Schema({
  ledId: { type: Number, required: true }, // ID del LED (0-11)
  estado: { type: Boolean, required: true }, // Estado del LED (true/false)
  Timestamp: { type: Date, default: Date.now } 
});

module.exports = mongoose.model("LedStatus", ledStatusSchema);