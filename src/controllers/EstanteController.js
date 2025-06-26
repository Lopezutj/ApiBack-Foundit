const EstanteModel = require('../models/EstanteModel');

class EstanteController{
    constructor(){}//constructor vacío para la clase EstanteController como POO

    //funcion del tipo POST para crear un nuevo estante
    async create(req,res){
        try{
            const createEstante = await EstanteModel.create(req.body);
            res.status(201).json({mensaje: "Estante creado", estante: createEstante});
        }
        catch(err){
            res.status(500).json({error: "Error al crear el estante", message: err.message});
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