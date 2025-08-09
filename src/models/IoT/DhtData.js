const mongoose = require("mongoose");

const dhtDataSchema = new mongoose.Schema({
  temperatura: { type: Number, required: true },
  humedad: { type: Number, required: true }
}, { timestamps: true }); 

module.exports = mongoose.model("DhtData", dhtDataSchema);
