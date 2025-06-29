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
    }

});

module.exports =  mongoose.model('Material',MaterialSchema);//exporta el modelo 