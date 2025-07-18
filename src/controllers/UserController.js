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
            if(!req.body.name || !req.body.apellido || !req.body.email || !req.body.password || !req.body.tipo) {
                return res.status(400).json({ error: "Faltan datos requeridos" });
            }

            const createUser = await UserModel.create(req.body);
            res.status(201).json({
                mensaje: "Usuario creado",
                usuario: {
                    name: createUser.name,
                    email: createUser.email,
                }
            });
        } catch (err) {
            res.status(500).json({ error: "Error al crear el usuario", message: err.message });
        }
    }


    // Obtener todos los usuarios
    async getAllUsers(req, res) {
        try{
            const users = await UserModel.find(); // Usar find() de Mongoose para obtener todos los usuarios
            if (users.length === 0) { //validar si no hay usuarios
                return res.status(404).json({ error: "No se encontraron usuarios" });
            }
            res.status(200).json({
                mensaje: "Usuarios encotrados",
                total: users.length, // Total de usuarios encontrados
                usuarios: users.map(user => ({
                    _id: user._id,
                    name: user.name,
                    apellido: user.apellido,
                    email: user.email,
                    tipo: user.tipo,
                    timestamp: user.Timestamp
                })) // Mapear los usuarios para devolver solo los campos necesarios

            });
        }catch (error) {
            res.status(500).json({ error: "Error al obtener los usuarios", message: error.message });
        }
    }

    // Obtener usuario por nombre
    async getUserbyname(req, res) {

        // Validar si el nombre está presente en la solicitud
        if(!req.params.name) {
            return res.status(401).json({ error: "Nombre de usuario no proporcionado" });
        }   

        console.log("Nombre de usuario recibido:", req.params.name); // Verificar el nombre recibido

        try {
            const user = await UserModel.findOne({name: req.params.name}); // Usar findById() de Mongoose
            //console.log("Usuario encontrado:", user); // Verificar qué devuelve

            if (!user) {
                return res.status(401).json({ error: "Usuario no encontrado" });
            }

            res.status(200).json({
                mensaje : "Usuario encontrado",
                usuario: {
                    _id : user._id,
                    name : user.name,
                    apellido : user.apellido,
                    email: user.email,
                    tipo: user.tipo,
                    timestamp: user.Timestamp
                }
            });
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