const MaterialModel = require('../models/MaterialModel');

class MaterialController{
    constructor() {}

    //funcion POST para crear material
    async create(req,res){
        try{
            const createMaterial = await MaterialModel.create(req.body);
            res.status(201).json({mensaje:"Material resgistrado", material:createMaterial});
        }catch(err){
            res.status(500).json({error:"Error, no se ha registrado el material", message: err.mensaje})
        }
    }//cierre de creacion de material

    async getMaterialById(req, res){
        try{
            const materialId = await MaterialModel.findById(req.params.id);
            if(!materialID){
                return res.status(404).json({error:"Material no encontrado"})
            }
            res.status(200).json({mensaje:"Material encontrado", material:materialId});
        }
        catch(err){
            res.status(500).json({error:"Error al obtener el material", message: err.mensaje})
        }
    }//cierre de la funcion getMaterialById


    //funcion para encontrar material por nombre
    async getMaterialByNombre(req, res){
        try{
            const nombre = req.query.nombre;//obtener el nombre del material de los parametros de consulta
            const materiales = await MaterialModel.find({nombre:nombre});//filtrar materiales por nombre
            if(materiales.length === 0){
                return res.status(404).json({error:"No se encontraron materiales con ese nombre"})
            }
            res.status(200).json({mensaje:"Materiales encontrados", materiales:materiales});
        }
        catch(err){
            res.status(500).json({error:"Error al obtener los materiales", message: err.mensaje})
        }
    }//cierre de la funcion getMaterialByNombre



    async updateMaterialById(req, res){
        try{
            const materialId = await MaterialModel.findByIdAndUpdate(req.params.id, req.body, {new:true});
            if(!materialId){
                return res.status(404).json({error:"Material no encontrado"})
            }
            res.status(200).json({mensaje:"Material actualizado", material:materialId});
        }
        catch(err){
            res.status(500).json({error:"Error al actualizar el material", message: err.mensaje})
        }  
    }//cierre de la funcion updateMaterialById

    async deleteMaterialById(req, res){
        try{
            const deleteMaterialById = await MaterialModel.findByIdAndDelete(req.params.id);
            if(!deleteMaterialById){
                return res.status(404).json({error:"Material no encontrado"})
            }
            res.status(200).json({mensaje:"Material eliminado", material:deleteMaterialById});
        }
        catch(err){
            res.status(500).json({error:"Error al eliminar el material", message: err.mensaje})
        }

    }//cierre de la funcion deleteMaterialById

}//cierre de la clase MaterialController

module.exports = new MaterialController(); // Exportar una instancia de la clase MaterialController