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

    //funcion GET para obtener todos los materiales
    async getAllMateriales(req, res){
        try{
            // Buscar usuarios que tengan materiales en dispositivos
            const usuariosConMateriales = await UserModel.find({
                "almacen.estantes.dispositivos.materiales.0": { $exists: true }
            }, 'almacen');

            if(usuariosConMateriales.length === 0){
                return res.status(404).json({error:"No se encontraron materiales"});
            }

            // Extraer todos los materiales de todos los dispositivos
            let todosLosMateriales = [];
            usuariosConMateriales.forEach(usuario => {
                usuario.almacen.forEach(almacen => {
                    if(almacen.estantes && almacen.estantes.length > 0) {
                        almacen.estantes.forEach(estante => {
                            if(estante.dispositivos && estante.dispositivos.length > 0) {
                                estante.dispositivos.forEach(dispositivo => {
                                    if(dispositivo.materiales && dispositivo.materiales.length > 0) {
                                        dispositivo.materiales.forEach(material => {
                                            todosLosMateriales.push({
                                                _id: material._id,
                                                name: material.name,
                                                description: material.description,
                                                cantidad: material.cantidad,
                                                ubicacion: material.ubicacion,
                                                movimientos: material.movimientos,
                                                Timestamp: material.Timestamp,
                                                // Información de contexto
                                                dispositivo: {
                                                    _id: dispositivo._id,
                                                    celda: dispositivo.celda
                                                },
                                                estante: {
                                                    _id: estante._id,
                                                    name: estante.name,
                                                    nameDispositivo: estante.nameDispositivo,
                                                    ip: estante.ip
                                                },
                                                almacen: {
                                                    _id: almacen._id,
                                                    name: almacen.name,
                                                    direccion: almacen.direccion
                                                }
                                            });
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            });

            if(todosLosMateriales.length === 0){
                return res.status(404).json({error:"No se encontraron materiales"});
            }

            res.status(200).json({
                mensaje:"Materiales encontrados", 
                materiales: todosLosMateriales,
                total: todosLosMateriales.length
            });
        }
        catch(err){
            res.status(400).json({error:"Error al obtener los materiales", message: err.message});
        }
    }

    //funcion para filtrar materiales por nombre
    async getMaterialByNombre(req, res){
        try{
            // Obtener el nombre del material desde los parámetros de ruta o query
            const nombreMaterial = req.params.name || req.query.nombre || req.query.name;

            console.log('Nombre del material a buscar:', nombreMaterial);
            console.log('Parámetros de ruta:', req.params);
            console.log('Query parameters:', req.query);

            if(!nombreMaterial){
                return res.status(400).json({error:"Nombre del material requerido"});
            }

            // Validar que el nombre solo contenga caracteres válidos
            if(!nombreMaterial.match(/^[a-zA-Z0-9\sáéíóúñÁÉÍÓÚÑ.-]+$/)){
                return res.status(422).json({error:"El nombre del material contiene caracteres no válidos"});
            }

            // Buscar usuarios que tengan materiales en dispositivos
            const usuariosConMateriales = await UserModel.find({
                "almacen.estantes.dispositivos.materiales.name": {
                    $regex: nombreMaterial, 
                    $options: "i" // Búsqueda insensible a mayúsculas y minúsculas
                }
            }, 'almacen');

            if(usuariosConMateriales.length === 0){
                return res.status(404).json({error:"No se encontraron materiales con ese nombre"});
            }

            // Extraer todos los materiales que coincidan con el nombre
            let materialesEncontrados = [];
            usuariosConMateriales.forEach(usuario => {
                usuario.almacen.forEach(almacen => {
                    if(almacen.estantes && almacen.estantes.length > 0) {
                        almacen.estantes.forEach(estante => {
                            if(estante.dispositivos && estante.dispositivos.length > 0) {
                                estante.dispositivos.forEach(dispositivo => {
                                    if(dispositivo.materiales && dispositivo.materiales.length > 0) {
                                        // Filtrar materiales por nombre
                                        const materialesCoincidentes = dispositivo.materiales.filter(
                                            material => material.name.toLowerCase().includes(nombreMaterial.toLowerCase())
                                        );
                                        
                                        materialesCoincidentes.forEach(material => {
                                            materialesEncontrados.push({
                                                _id: material._id,
                                                name: material.name,
                                                description: material.description,
                                                cantidad: material.cantidad,
                                                ubicacion: material.ubicacion,
                                                movimientos: material.movimientos,
                                                Timestamp: material.Timestamp,
                                                // Información de contexto
                                                dispositivo: {
                                                    _id: dispositivo._id,
                                                    celda: dispositivo.celda
                                                },
                                                estante: {
                                                    _id: estante._id,
                                                    name: estante.name,
                                                    nameDispositivo: estante.nameDispositivo,
                                                    ip: estante.ip
                                                },
                                                almacen: {
                                                    _id: almacen._id,
                                                    name: almacen.name,
                                                    direccion: almacen.direccion
                                                }
                                            });
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            });

            if(materialesEncontrados.length === 0){
                return res.status(404).json({error:"No se encontraron materiales con ese nombre"});
            }

            console.log('Materiales encontrados:', materialesEncontrados);

            res.status(200).json({
                mensaje:"Materiales encontrados por nombre",
                materiales: materialesEncontrados,
                total: materialesEncontrados.length,
                busqueda: nombreMaterial
            });

        }catch(err){
            res.status(500).json({error:"Error al obtener los materiales", message: err.message})
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