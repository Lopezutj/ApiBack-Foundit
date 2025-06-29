const DispositivoModel = require('../models/DispositivoModel');

//controlador de Dispositivo
class DispositivoController{
    constructor(){}//constructor vacío para la clase DispositivoController como POO

    //funcion del tipo POST para crear un nuevo dispositivo
    async create(req,res){
        try{
            const createDispositivo = await DispositivoModel.create(req.body);
            res.status(201).json({mensaje: "Dispositivo creado", dispositivo: createDispositivo});
        }
        catch(err){
            res.status(500).json({error: "Error al crear el dispositivo", message: err.message});
        }
    }//cierre la función create

    //funcion del tipo GET para obtener un dispositivo por ID
    async getDispositivoById(req,res){
        try{
            const dispositivoId = await DispositivoModel.findById(req.params.id);
            if(!dispositivoId){
                return res.status(404).json({error: "Dispositivo no encontrado"});
            }
            res.status(200).json({mensaje: "Dispositivo encontrado", dispositivo: dispositivoId});
        }
        catch(err){
            res.status(500).json({error: "Error al obtener el dispositivo", message: err.message});
        }
    }//cierre la función getDispositivoById

    //funcion para obtener todos los dispositivos
    async getAllDispositivos(req,res){
        try{
            const dispositivos = await DispositivoModel.find();
            res.status(200).json({mensaje: "Dispositivos encontrados", dispositivos: dispositivos});
        }
        catch(err){
            res.status(500).json({error: "Error al obtener los dispositivos", message: err.message});
        }
    }//cierre la función getAllDispositivos

    //funcion para actualizar un dispositivo por ID
    async updateDispositivoById(req,res){
        try{
            const dispositivoId = await DispositivoModel.findByIdAndUpdate(req.params.id, req.body, {new: true});
            if(!dispositivoId){
                return res.status(404).json({error: "Dispositivo no encontrado"});
            }
            res.status(200).json({mensaje: "Dispositivo actualizado", dispositivo: dispositivoId});
        }
        catch(err){
            res.status(500).json({error: "Error al actualizar el dispositivo", message: err.message});
        }
    }//cierre la función updateDispositivoById

    //funcion para eliminar un dispositivo por ID
    async deleteDispositivoById(req,res){
        try{
            const dispositivoId = await DispositivoModel.findByIdAndDelete(req.params.id);
            if(!dispositivoId){
                return res.status(404).json({error: "Dispositivo no encontrado"});
            }
            res.status(200).json({mensaje: "Dispositivo eliminado", dispositivo: dispositivoId});
        }
        catch(err){
            res.status(500).json({error: "Error al eliminar el dispositivo", message: err.message});
        }
    }//cierre la función deleteDispositivoById

}//cierre la clase DispositivoController

module.exports = new DispositivoController(); // Exportar una instancia de la clase DispositivoController