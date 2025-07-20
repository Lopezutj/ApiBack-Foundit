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
            res.status(400).json({ error: "Error al crear el usuario", message: err.message });
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
            res.status(400).json({ error: "Error al obtener los usuarios", message: error.message });
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
                return res.status(404).json({ error: "Usuario no encontrado" });
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
            res.status(400).json({ error: "Error al obtener el usuario", message: error.message });
        }
    }

    // Actualizar usuario
    async updateUser(req, res) {
        // Validar si el ID del usuario está presente en la solicitud
            
        try{ 

            const _id = req.params.id; // Desestructurar el ID del usuario de los parámetros de la solicitud

            console.log("ID del usuario recibido:", _id); // Verificar el ID recibido
            //validar si el del usuario existe 
            if(!_id) {
                return res.status(404).json({ error: "ID de usuario no proporcionado" });
            }

            //validar si el usuario existe 
            const user = await UserModel.findById(_id);
            console.log("Usuario encontrado:", user); // Verificar qué devuelve

            if(!user){
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            //validar si el cuerpo de la solicitud tiene datos
            if(!req.body.name && !req.body.apellido && !req.body.email && !req.body.tipo) {
                return res.status(404).json({ error: "No se proporcionaron datos para actualizar" });
            }

            //actualizar el usuario
            const updatedUser = await UserModel.findByIdAndUpdate(
                _id, // ID del usuario a actualizar
                req.body, // Datos a actualizar
                { new: true,runValidators: true } // Devolver el documento actualizado
            );

            if (!updatedUser) {
                return res.status(422).json({ error: "Error al actualizar el usuario" });
            }

            res.status(200).json({
                mensaje: "Usuario actualizado",
                usuario:updatedUser
            });

        }catch (error) {
            res.status(400).json({ error: "Error al actualizar el usuario", message: error.message });
        }
    }

    // Eliminar usuario
    async deleteUser(req, res) {
        try{

            const _id = req.params.id; // Desestructurar el ID del usuario de los parámetros de la solicitud

            if(!_id) {
                return res.status(401).json({ error: "ID de usuario no proporcionado" });
            }

            let user = await UserModel.findById(_id); // Buscar el usuario por ID

            if(!user) {
                return res.status(401).json({ error: "Usuario no encontrado" });
            }

            //eliminar el usuario
            let deletedUser = await UserModel.findByIdAndDelete(_id); // Eliminar el usuario por ID

            if(!deletedUser) {
                return res.status(422).json({ error: "Error al eliminar el usuario" });
            }

            res.status(200).json({
                mensaje: "Usuario eliminado",
                usuario: {
                    _id: deletedUser._id,
                    name: deletedUser.name,
                    email: deletedUser.email,
                    tipo: deletedUser.tipo
                }
            });

        }catch (error) {
            res.status(400).json({ error: "Error al eliminar el usuario", message: error.message });
        }
    }
}

module.exports = new UserController();