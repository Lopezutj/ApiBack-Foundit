const express = require('express');
const router = express.Router();
const UserModel = require('../../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


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
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    tipo: user.tipo,
                }
            });
    
        }catch (err) {
                res.status(500).json({ error: "Error al iniciar sesión", message: err.message });
        }
    
    }

    // Validar token JWT
    async validateToken(req, res) {
        try {
            const authHeader = req.headers['authorization'];

            if (!authHeader) {
                return res.status(401).json({ 
                    valid: false, 
                    error: 'Token no proporcionado' 
                });
            }

            // Extraer el token, removiendo "Bearer " si existe
            const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

            // Verificar el token
            jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
                if (err) {
                    return res.status(401).json({ 
                        valid: false, 
                        error: 'Token inválido o expirado' 
                    });
                }

                // Token válido, verificar si el usuario aún existe en la base de datos
                try {
                    const user = await UserModel.findById(decoded.id);
                    
                    if (!user) {
                        return res.status(401).json({ 
                            valid: false, 
                            error: 'Usuario no encontrado' 
                        });
                    }

                    // Respuesta exitosa
                    res.status(200).json({
                        valid: true,
                        user: {
                            id: user._id,
                            email: user.email,
                            name: user.nombre, // Usar 'nombre' según tu modelo
                            tipo: user.tipo
                        }
                    });

                } catch (dbErr) {
                    res.status(500).json({ 
                        valid: false, 
                        error: 'Error interno del servidor' 
                    });
                }
            });

        } catch (err) {
            res.status(500).json({ 
                valid: false, 
                error: 'Error interno del servidor',
                message: err.message 
            });
        }
    }
}

module.exports = new LoginController(); // Exportar una instancia del controlador para usarlo en otros archivos