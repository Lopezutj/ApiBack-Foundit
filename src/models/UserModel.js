const mongoose = require('mongoose'); // importar mongoose para definir el esquema del modelo
const bcrypt = require('bcrypt'); // importar bcrypt para hashear contraseñas

const UsuarioSchema = new mongoose.Schema({
    nombre: {
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
    },
    tipo: { 
        type: String,
        enum: ['admin', 'operador'],
        required: true 
    },
});

//Milware para hashear la contraseña antes de guardar el usuario
UsuarioSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10); // Generar un salt
        this.password = await bcrypt.hash(this.password, salt); // Hashear la contraseña
    }
    next(); // Continuar con el siguiente middleware
});

module.exports = mongoose.model('Usuario', UsuarioSchema); // Exportar el modelo de usuario