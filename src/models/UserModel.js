const mongoose = require('mongoose'); // importar mongoose para definir el esquema del modelo
const bcrypt = require('bcrypt'); // importar bcrypt para hashear contraseñas
const jwt = require('jsonwebtoken'); // importar jsonwebtoken para generar tokens de autenticación
const dotenv = require('dotenv'); // importar dotenv para manejar variables de entorno
dotenv.config(); // cargar las variables de entorno desde el archivo .env
const AlmacenModel = require('./AlmacenModel'); // importar el modelo de Almacen

const UsuarioSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    apellido:{
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8 // establecer una longitud mínima para la contraseña
    },
    tipo: { 
        type: String,
        enum: ['admin', 'operador'],
        required: true 
    },
    estado: {
        type: Boolean,
        default: true
    },
    Timestamp:{
        type: Date,
        default: Date.now, // Establecer la fecha y hora actual como valor por defecto
    },
    almacen: AlmacenModel.schema // subdocumento de almacen embebido en el usuario
});

//Milware para hashear la contraseña antes de guardar el usuario
UsuarioSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10); // Generar un salt
        this.password = await bcrypt.hash(this.password, salt); // Hashear la contraseña
    }
    next(); // Continuar con el siguiente middleware
});

UsuarioSchema.methods.generarAuthToken = function() { // Método para generar un token de autenticación
    //lógica para generar un token JWT
    return jwt.sign({
        _id:this._id, // ID del usuario
        name: this.name, // datos a enviar en el token
        email: this.email, // datos a enviar en el token
        tipo: this.tipo, // datos a enviar en el token
    },process.env.JWT_SECRET, { // usar la clave secreta del entorno
        expiresIn: '6h', // el token expirará en 1 hora
    });
}

module.exports = mongoose.model('user', UsuarioSchema); // Exportar el modelo de usuario