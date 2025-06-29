const express = require('express');
const router = express.Router();
const UserModel = require('../../models/UserModel');
const bcrypt = require('bcrypt');


class LoginController {

    constructor(){}// Constructor de la clase LoginController

    // Iniciar sesión
    async login(req,res){
        try {

            const {email,password} = req.body;
                
            const user = await UserModel.findOne({ email: email }); // Buscar el usuario por email
                if (!user) {
                    return res.status(404).json({ error: "Usuario no encontrado" });
                }
             //verificar contraseña
            const isvalidPassword = await bcrypt.compare(password, user.password); // Comparar la contraseña
                if (!isvalidPassword) {
                    return res.status(401).json({ error: "Contraseña y/o incorrecta" });
                }

            res.status(200).json({ 
                mensaje: "Inicio de sesión exitoso",
                token: user.generarAuthToken(), // Generar el token de autenticación
            });
    
        }catch (err) {
                res.status(500).json({ error: "Error al iniciar sesión", message: err.message });
        }
    
    }
}

module.exports = new LoginController(); // Exportar una instancia del controlador para usarlo en otros archivos