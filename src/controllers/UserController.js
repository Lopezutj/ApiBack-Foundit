const UserModel = require('../models/UserModel'); // Importar el modelo de usuario
const bcrypt = require('bcrypt'); // Importar bcrypt para hashear contraseñas

class UserController {
    constructor() {}

    // Crear usuario
    async create(req, res) {
        try {
            //console.log("Contraseña recibida: ",req.body.password);

            // Validar si el usuario ya existe
            const existingUser = await UserModel.findOne({ email: req.body.email });
            if (existingUser) {
                return res.status(400).json({ error: "El usuario ya existe" });
            }
            if(!req.body.nombre || !req.body.apellido || !req.body.email || !req.body.password || !req.body.tipo) {
                return res.status(400).json({ error: "Faltan datos requeridos" });
            }

            const createUser = await UserModel.create(req.body);
            res.status(201).json({
                mensaje: "Usuario creado",
                usuario: {
                    nombre: createUser.nombre,
                    email: createUser.email,
                }
            });
        } catch (err) {
            res.status(500).json({ error: "Error al crear el usuario", message: err.message });
        }
    }


    // Obtener todos los usuarios
    async getAllUsers(req, res) {
        try {
            const users = await UserModel.find(); // Usar find() de Mongoose
            if (users.length === 0) {
                return res.status(404).json({ error: "No hay usuarios registrados" });
            }
            res.status(200).json({ mensaje: "Usuarios encontrados", usuarios: users });
        } catch (err) {
            res.status(500).json({ error: "Error al obtener los usuarios", message: err.message });
        }
    }

    // Obtener usuario por ID
    async getUserbyId(req, res) {
        try {
            const userId = await UserModel.findById(req.params.id); // Usar findById() de Mongoose
            if (!userId) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }
            res.status(200).json({ mensaje: "Usuario encontrado", usuario: userId });
        } catch (error) {
            res.status(500).json({ error: "Error al obtener el usuario", message: error.message });
        }
    }

    // Actualizar usuario
    async updateUser(req, res) {
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );
            if (!updatedUser) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }
            res.status(200).json({ mensaje: "Usuario actualizado", usuario: updatedUser });
        } catch (error) {
            res.status(500).json({ error: "Error al actualizar el usuario", message: error.message });
        }
    }

    // Eliminar usuario
    async deleteUser(req, res) {
        try {
            const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
            if (!deletedUser) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }
            res.status(200).json({ mensaje: "Usuario eliminado" });
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar el usuario", message: error.message });
        }
    }
}

module.exports = new UserController();