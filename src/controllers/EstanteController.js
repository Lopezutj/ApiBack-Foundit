const AlmacenModel = require('../models/AlmacenModel');
const EstanteModel = require('../models/EstanteModel');
const UserModel = require('../models/UserModel');

class EstanteController{
    constructor(){}//constructor vacío para la clase EstanteController como POO

    //funcion del tipo POST para crear un nuevo estante
    async create(req,res){

        //obtenemos el usuario que está creando el estante
        let usuario = req.usuario; // Asumiendo que el middleware de autenticación ha agregado el usuario a la solicitud

        //verificar si el usuario tiene permisos para crear un estante
        if(usuario.tipo !== 'admin'){
            return res.status(403).json({error: "No tienes permisos para crear un estante"});
        }

        //validamos los datos del cuerpo de la solicitud
        if(!req.body.name || !req.body.nameDispositivo || !req.body.ip){
            return res.status(400).json({error: "Faltan datos requeridos para crear el estante"});
        }

        //validamos id del usuario
        if(!usuario._id){
            return res.status(401).json({error: "Usuario no entrado o no existe"});
        }

        //creamos el estante 
        try {

            //console.log('Usuario del token:', usuario); // Ver qué contiene el token
            //console.log('ID del usuario:', usuario._id); // Ver el ID específico
        
            const updateEstante = await UserModel.findByIdAndUpdate(
                usuario._id, // ID del almacén al que se le agregará el estante
                { $push: { "almacen.0.estantes": req.body }  }, // Agregar el nuevo estante al array de estantes del usuario
                { new: true } // Devolver el documento actualizado
            );


            if (!updateEstante) {
                console.error("Error al agregar el estante:", updateEstante);
                return res.status(404).json({ error: "Error al agregar el estante" });
            }

            const newEstante = updateEstante.almacen[0].estantes[updateEstante.almacen[0].estantes.length - 1]; // Obtener el último estante agregado

            res.status(201).json({
                mensaje: "Estante creado y asociado al usuario",
                estante: newEstante,
                usuarioId: usuario._id
            });
        } catch (err) {
            res.status(500).json({ error: "Error al crear el estante", message: err.message });
        }

    }//cierre la función create

    //funcion del tipo GET para obtener un estante por ID
    async getEstanteById(req,res){
        try{
            const estanteId = await EstanteModel.findById(req.params.id);
            if(!estanteId){
                return res.status(404).json({error: "Estante no encontrado"});
            }
            res.status(200).json({mensaje: "Estante encontrado", estante: estanteId});
        }
        catch(err){
            res.status(500).json({error: "Error al obtener el estante", message: err.message});
        }
    }//cierre la función getEstanteById

    //funcion para obtener todos los estantes
    async getAllEstantes(req,res){
        try{
            const estantes = await EstanteModel.find();
            res.status(200).json({mensaje: "Estantes encontrados", estantes: estantes});
        }
        catch(err){
            res.status(500).json({error: "Error al obtener los estantes", message: err.message});
        }
    }//cierre la función getAllEstantes

    //funcion para actualizar un estante por ID
    async updateEstanteById(req,res){
        try{
            const estanteId = await EstanteModel.findByIdAndUpdate(req.params.id, req.body, {new: true});
            if(!estanteId){
                return res.status(404).json({error: "Estante no encontrado"});
            }
            res.status(200).json({mensaje: "Estante actualizado", estante: estanteId});
        }
        catch(err){
            res.status(500).json({error: "Error al actualizar el estante", message: err.message});
        }
    }
    //cierre la función updateEstanteById

    //funcion para eliminar un estante por ID
    async deleteEstanteById(req,res){
        try{
            const estanteId = await EstanteModel.findByIdAndDelete(req.params.id);
            if(!estanteId){
                return res.status(404).json({error: "Estante no encontrado"});
            }
            res.status(200).json({mensaje: "Estante eliminado", estante: estanteId});
        }
        catch(err){
            res.status(500).json({error: "Error al eliminar el estante", message: err.message});
        }
        }
    //cierre la función deleteEstanteById   


}//cierre la clase EstanteController

module.exports = new EstanteController(); // Exportar una instancia de la clase EstanteController