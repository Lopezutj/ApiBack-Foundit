const MaterialModel = require('../models/MaterialModel');
const UserModel = require('../models/UserModel');

class MaterialController{
    constructor() {}

    //funcion POST para crear material
    async create(req,res){
        let usuario = req.usuario;
        // Validar usuario
        if(!usuario || !usuario._id){
            return res.status(401).json({error: "Usuario no autenticado o no existe"});
        }
        // Validar datos de la solicitud
        const { celda, materiales } = req.body;
        if(!celda || !materiales){
            return res.status(400).json({error: "Faltan datos requeridos: celda y materiales"});
        }
        try {
            // Obtener el usuario completo para validar duplicados
            const userDoc = await UserModel.findById(usuario._id);
            if(!userDoc || !userDoc.almacen || !userDoc.almacen[0] || !userDoc.almacen[0].estantes[0]){
                return res.status(404).json({error: "No se encontró almacén o estante para el usuario"});
            }
            const dispositivos = userDoc.almacen[0].estantes[0].dispositivos || [];
            /* // Validar duplicado de celda
            const existeCelda = dispositivos.some(d => d.celda === celda);
            if(existeCelda){
                return res.status(409).json({error: "Ya existe un dispositivo con esa celda"});
            } */
            // Agregar el nuevo dispositivo
            // Normalizar los materiales para asegurar que cada uno tenga el campo 'nombre'
            let materialesFormateados = Array.isArray(materiales) ? materiales : [materiales];
            materialesFormateados = materialesFormateados.map(mat => ({
                nombre: mat.name || mat.nombre || '',
                descripcion: mat.description || mat.descripcion || '',
                cantidad: mat.cantidad,
                ubicacion: mat.ubicacion,
                movimientos: mat.movimientos || [],
                Timestamp: mat.Timestamp || Date.now()
            }));
            const updateDispositivo = await UserModel.findByIdAndUpdate(
                usuario._id,
                { $push: {
                    "almacen.0.estantes.0.dispositivos": {
                        celda,
                        materiales: materialesFormateados
                    }
                }},
                { new: true }
            );
            if(!updateDispositivo || !updateDispositivo.almacen[0].estantes[0].dispositivos){
                return res.status(500).json({error: "Error al agregar el material al dispositivo"});
            }
            const dispositivosActualizados = updateDispositivo.almacen[0].estantes[0].dispositivos;
            const nuevoDispositivo = dispositivosActualizados[dispositivosActualizados.length - 1];
            res.status(201).json({
                mensaje: "Dispositivo y material creados y asociados al usuario",
                dispositivo: nuevoDispositivo,
                materiales: nuevoDispositivo.materiales,
                usuarioId: usuario._id
            });
        } catch(err){
            return res.status(500).json({error: "Error al crear el dispositivo", message: err.message});
        }
    }//cierre de creacion de material

    //funcion GET para obtener todos los materiales
    async getAllMateriales(req, res){
        try {
            const usuario = req.usuario;
            if (!usuario || !usuario._id) {
                return res.status(401).json({error: "Usuario no autenticado o no existe"});
            }
            // Buscar el usuario logueado y su almacén
            const userDoc = await UserModel.findById(usuario._id);
            if (!userDoc || !userDoc.almacen || userDoc.almacen.length === 0) {
                return res.status(404).json({error: "No se encontró almacén para el usuario"});
            }
            // Si se quiere filtrar por nombre de almacén, usar query
            const nombreAlmacen = req.query.nombreAlmacen || userDoc.almacen[0].name;
            // Buscar el almacén correspondiente
            const almacen = userDoc.almacen.find(a => a.name === nombreAlmacen);
            if (!almacen) {
                return res.status(404).json({error: "No se encontró el almacén solicitado"});
            }
            // Extraer todos los materiales de todos los dispositivos de todos los estantes
            let materiales = [];
            almacen.estantes.forEach(estante => {
                estante.dispositivos.forEach(dispositivo => {
                    if (Array.isArray(dispositivo.materiales)) {
                        materiales = materiales.concat(dispositivo.materiales);
                    }
                });
            });
            if (materiales.length === 0) {
                return res.status(404).json({error: "No se encontraron materiales en el almacén"});
            }
            res.status(200).json({mensaje: "Materiales encontrados", materiales});
        } catch(err) {
            res.status(500).json({error: "Error al obtener los materiales", message: err.message});
        }
    }


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