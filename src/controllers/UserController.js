const UserModel = require('../models/UserModel'); // Importar el modelo de usuario
const bcrypt = require('bcrypt'); // Importar bcrypt para hashear contraseñas

class UserController {
    constructor() {}

    // Crear usuario
    async create(req, res) {
        try {
            console.log("Contraseña recibida: ",req.body.password);
            const createUser = await UserModel.create(req.body);
            res.status(201).json({ mensaje: "Usuario creado", 
                usuario: createUser });
        } catch (err) {
            res.status(500).json({ error: "Error al crear el usuario", message: err.message });
        }
    }

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
                return res.status(401).json({ error: "Contraseña incorrecta" });
            }
            res.status(200).json({ mensaje: "Inicio de sesión exitoso"});

        }catch (err) {
            res.status(500).json({ error: "Error al iniciar sesión", message: err.message });
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