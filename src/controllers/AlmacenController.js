const AlmacenModel = require('../models/AlmacenModel');
const UserModel = require('../models/UserModel');


//controlador de Almacen
class AlmacenController{
    constructor(){}// Constructor vacío para la clase AlmacenController como POO

    // funcion del tipo POST para crear un nuevo almacen
    async create(req,res){

        try{

        //obtenemos el usuario que está creando el almacen
        const usuario = req.usuario; // Asumiendo que el middleware de autenticación ha agregado el usuario a la solicitud
        // Verificar si el usuario tiene permisos para crear un almacén
        if (usuario.tipo !== 'admin') {
            return res.status(403).json({ error: "No tienes permisos para crear un almacén" });
        }
        // Validar los datos del cuerpo de la solicitud
        if (!req.body.direccion || !req.body.name) {
            return res.status(400).json({ error: "Faltan datos requeridos para crear el almacén" });
        }

        
        console.log('Usuario del token:', usuario); // Ver qué contiene el token
        console.log('ID del usuario:', usuario._id); // Ver el ID específico

        if(!usuario._id){
            console.log(usuario);
            return res.status(400).json({ error: "Usuario no encontrado o no existe" });
        }

        //console.log('Datos del cuerpo de la solicitud:', req.body); // Ver los datos del cuerpo de la solicitud
            // Crear el almacén
            const updateUser = await UserModel.findByIdAndUpdate(
                usuario._id, // ID del usuario logueado
                { $push: { almacen: req.body } }, // Agregar el nuevo almacén al array de almacenes del usuario
                { new: true } // Devolver el documento actualizado
            );
            
            const newAlmacen = updateUser.almacen[updateUser.almacen.length - 1]; // Obtener el último almacén agregado}
            
            res.status(201).json({ 
                mensaje: "Almacen creado y asociado al usuario", 
                almacen: newAlmacen,
                usuarioId: usuario._id
            });
        }catch (err){
            res.status(500).json({ error: "Error al crear el almacen", message: err.message });
        }

    }// Crear un nuevo almacen     

    //funcion del tipo GET para obtener alamcen por ID
    async getAlmacenById(req, res){
        try{
            const almacenId = await AlmacenModel.findById(req.params.id); // se usa la fucnción findById de Mongoose
            if (!almacenId){
                return res.status(404).json({error: "Almacen no encontrado" });
            }
            res.status(200).json({mensaje: "Almacen encontrado", almacen: almacenId });
        }catch (err){
            res.status(500).json({ error: "Error al obtener el almacen", message: err.message });
        }
    }//cierre la función getAlmacenById

    //funcion del tipo GET para filtrar almacenes por direccion
    async getAlmacenByDireccion(req, res){
        try{
            const direccion = req.query.direccion; // Obtener la dirección de los parámetros de consulta
            const almacenes = await AlmacenModel.find({ direccion: direccion }); // Filtrar almacenes por dirección
            if (almacenes.length === 0){
                return res.status(404).json({ error: "No se encontraron almacenes con esa dirección" });
            }
            res.status(200).json({ mensaje: "Almacenes encontrados", almacenes: almacenes });
        }catch (err){
            res.status(500).json({ error: "Error al obtener los almacenes", message: err.message });
        }
    }//cierre la función getAlmacenByDireccion

    //funcion del tipo put para actualizar un almacen por ID
    async updateAlmacenById(req,res){
        // Se usa la función findByIdAndUpdate de Mongoose para actualizar un almacen por ID
        try{
            const updateAlmacenById = await AlmacenModel.findByIdAndUpdate
            (
                req.params.id, // ID del almacen a actualizar
                req.body, // Datos a actualizar
                { new: true } // Devuelve el documento actualizado
            );
            if (!updateAlmacenById){
                return res.status(404).json({ error: "Almacen no encontrado" });
            }
            res.status(200).json({ mensaje: "Almacen actualizado", almacen: updateAlmacenById });
        }catch (err){
            res.status(500).json({error: "Error al actualizar el almacen", message: err.message });
        }
    }//cierre la función updateAlmacenById

    //funcion del tipo delete para eliminar un almacen por ID
    async deleteAlmacenById(req, res){
        try{
            const deleteAlmacenById = await AlmacenModel.findByIdAndDelete(req.params.id); // Se usa la función findByIdAndDelete de Mongoose
            if (!deleteAlmacenById){
                return res.status(404).json({ error: "Almacen no encontrado" });
            }
            res.status(200).json({ mensaje: "Almacen eliminado" });
        }catch (err){
            res.status(500).json({ error: "Error al eliminar el almacen", message: err.message });
        }
    }//cierre la función deleteAlmacenById


}//cierre la clase AlmacenController

module.exports = new AlmacenController(); // Exportar una instancia de AlmacenController