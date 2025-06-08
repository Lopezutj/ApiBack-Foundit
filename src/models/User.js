const moogose = require('mongoose');

const userSchema = new moogose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true // Agrega campos createdAt y updatedAt automáticamente
});

module.exports = moogose.model('User', userSchema); // Exportar el modelo de usuario