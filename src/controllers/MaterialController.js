const MaterialModel = require('../models/MaterialModel');
const UserModel = require('../models/UserModel');

class MaterialController{
    constructor() {}

    //funcion POST para crear material
    async create(req,res){
        let usuario = req.usuario; // Asumiendo que el middleware de autenticación ha agregado el usuario a la solicitud
        
                //validamos el id del usuario logueado
                if(!usuario._id){
                    return res.status(401).json({error: "Usuario no entrado o no existe"});
                }
                console.log('Cuerpo de la solicitud:', req.body); // Ver qué datos se están enviando en la solicitud
        
                //validamos los datos que vienen en el cuerpo de la solicitud
                if(!req.body.celda || !req.body.materiales){
                    return res.status(401).json({error: "Faltan datos requeridos para crear el dispositivo"});
                }
        
                //creamos el dispositivo y agregamos el material 
                try{
                    
                    //agregamos una celda al dispositivo
                const updateDispositivo = await UserModel.findByIdAndUpdate(
                        usuario._id, // ID del usuario al que se le agregará el dispositivo 
                        { $push: {
                            "almacen.0.estantes.0.dispositivos":{
                                celda: req.body.celda, // Agregar la celda del dispositivo
                                materiales: req.body.materiales // Agregar los materiales del dispositivo
                            } 
                        }}, // Agregar el nuevo dispositivo al array de dispositivos del usuario
                        { new: true } // Devolver el documento actualizado
                );
        
                if(!updateDispositivo.almacen[0].estantes[0].dispositivos){
                    return res.status(404).json({error: "Error al agregar el material al dispositivo"});
                
                }
        
                const dispositivos = updateDispositivo.almacen[0].estantes[0].dispositivos; //accedemos al array de dispositivos
                const newDispositivo = dispositivos[dispositivos.length - 1]; // Obtener el último dispositivo agregado
                const newMaterial = newDispositivo.materiales; // obtener los materiales del dispositivo
        
                res.status(201).json({
                    mensaje: "Dispositivo y material creados y asociados al usuario",
                    dispositivo: newDispositivo,
                    material: newMaterial,
                    usuarioId: usuario._id
                });
        
                }catch(err){
                    return res.status(500).json({error: "Error al crear el dispositivo", message: err.message});
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