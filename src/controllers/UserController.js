const UserModel = require('../models/UserModel'); //importar el modelo de usuario

class UserController{

    //constructor para inicializar el controlador
    constructor(){}

    //CRUD DE USUARIOS

    async create(req,res){
        try {
            const createUser = await UserModel.create(req.body); //crear un nuevo usuario usando el modelo UserModel
            res.status(201).json({mensaje: "Usuario creado",usuario: createUser}); //enviar una respuesta con el usuario creado
        } catch (err) {
            res.status(500).json({error: "Error al crear el usuario", message: err.message}); //enviar un error si ocurre
        }
    }

    async getAllUsers(req,res){
        try {
            const users = await UserModel.getAll(); //obtener todos los usuarios usando el modelo UserModel
            if(users.length === 0){
                return res.status(404).json({error: "No hay usuarios registrados"}); //enviar un error si no hay usuarios
            }
            res.status(200).json({mensaje: "Usuarios encontrados", usuarios: users}); //enviar una respuesta con los usuarios encontrados
        } catch (err) {
            res.status(500).json({error: "Error al obtener los usuarios", message: err.message}); //enviar un error si ocurre
            
        }
    }

    async getUserbyId(req,res){
        try {
            const userId = await UserModel.findById(req.params.id); //buscar un usuario por su ID usando el modelo UserModel
            if(!userId){
                return res.status(404).json({error: "Usuario no encontrado"}); //enviar un error si no se encuentra el usuario
            }
            res.status(200).json({mensaje: "Usuario encontrado", usuario: userId}); //enviar una respuesta con el usuario encontrado
        } catch (error) {
            res.status(500).json({error: "Error al obtener el usuario", message: error.message}); //enviar un error si ocurre
        }
    }

    async updateUser(req,res){
        try {
            res.status(200).json({mensaje: "Usuario actualizado"}); //enviar una respuesta con el usuario actualizado
        } catch (error) {
            res.status(500).json({error: "Error al actualizar el usuario", message: error.message}); //enviar un error si ocurre
        }
    }

    async deleteUser(req,res){
        try {
            
            res.status(200).json({mensaje: "Usuario eliminado"}); //enviar una respuesta con el usuario eliminado
        } catch (error) {
            res.status(500).json({error: "Error al eliminar el usuario", message: error.message}); //enviar un error si ocurre
        }
    }
}

module.exports = new UserController(); //exportar una instancia del controlador de usuario