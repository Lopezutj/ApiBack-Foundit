const mongoose = require('mongoose');//


//Schema de Material
const MaterialSchema =  new mongoose.Schema({
    nombre:{
        type:String,
        required:true
    },
    descripcion:{
        type:String
    },
    categoria:{
        type:String,
        required:true
    },
    cantidad:{
        type:Number,
        required:true
    },
    ubicacion:{
        type:String,
        required:true
    },
    movimentos:[{
        tipo:{
            type: String,
            enum: ['entrada', 'salida'], // Define los tipos de movimiento permitidos
            required: true
        },
        fecha:{
            type: Date,
            default: Date.now // Establece la fecha actual como valor por defecto
        }
        //aqui se pude agregar comapos como el usuario que realiza el movimiento y motivo
    }]

});

module.exports =  mongoose.model('Material',MaterialSchema);//exporta el modelo 