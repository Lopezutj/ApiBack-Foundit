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

    //funcion GET para obtener todos los materiales en la apk movil
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
                        materiales = materiales.concat(
                            dispositivo.materiales.map(m => ({
                                ...(typeof m.toObject === 'function' ? m.toObject() : m),
                                celda: dispositivo.celda
                            }))
                        );
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

    //metodo para obtener todos los materiales en general de todos los documentos de los usuarios para la web
    async AllMatariales(req,res){
        try {
            // Buscar todos los usuarios con al menos un almacén
            const usuarios = await UserModel.find({ "almacen.0": { $exists: true } });
            let materiales = [];

            usuarios.forEach(usuario => {
                usuario.almacen.forEach(almacen => {
                    almacen.estantes.forEach(estante => {
                        estante.dispositivos.forEach(dispositivo => {
                            dispositivo.materiales.forEach(material => {
                                materiales.push({
                                    _id : material._id,
                                    material: material.nombre,
                                    descripcion: material.descripcion,
                                    cantidad: material.cantidad,
                                    ubicacion: material.ubicacion,
                                    almacen: almacen.name,
                                    estante: estante.nombre,
                                    celda: dispositivo.celda,
                                    movimiento: material.movimientos,
                                    timestamp: material.Timestamp
                                });
                            });
                        });
                    });
                });
            });

            if (materiales.length === 0) {
                return res.status(404).json({ mensaje: "No hay materiales registrados" });
            }
            //console.log("Materiales encontrados:", materiales);

            res.status(200).json({ mensaje: "Materiales encontrados", materiales });
        } catch (err) {
            res.status(500).json({ error: "Error al obtener los materiales", message: err.message });
        }

    }

    //funcion para encontrar material por nombre
    async getMaterialByNombre(req, res){
        try {
            // Aceptar /materiales/name/:name o ?nombre=...
            const termRaw = req.params.nombre || req.params.name || req.query.nombre || req.query.name;
            if (!termRaw) {
                return res.status(400).json({ error: "Parámetro de búsqueda requerido (name|nombre)" });
            }
            const term = String(termRaw).trim().toLowerCase();

            const usuarios = await UserModel.find({ "almacen.0": { $exists: true } });
            let materiales = [];

            usuarios.forEach(usuario => {
                if (!usuario.almacen) return;
                usuario.almacen.forEach(almacen => {
                    if (!almacen.estantes) return;
                    almacen.estantes.forEach(estante => {
                        if (!estante.dispositivos) return;
                        estante.dispositivos.forEach(dispositivo => {
                            if (!dispositivo.materiales) return;
                            dispositivo.materiales.forEach(material => {
                                const nombreMat = typeof material.nombre === 'string' ? material.nombre.toLowerCase() : '';
                if (nombreMat.includes(term)) {
                                    materiales.push({
                                        _id: material._id,
                                        material: material.nombre,
                                        descripcion: material.descripcion,
                                        cantidad: material.cantidad,
                                        ubicacion: material.ubicacion,
                                        almacen: almacen.name,
                                        estante: estante.nombre,
                                        celda: dispositivo.celda,
                                        movimiento: material.movimientos,
                                        timestamp: material.Timestamp
                                    });
                                }
                            });
                        });
                    });
                });
            });

            if (materiales.length === 0) {
                return res.status(404).json({ error: "No se encontraron materiales con ese nombre" });
            }
            res.status(200).json({ mensaje: "Materiales encontrados", materiales });
        } catch (err) {
            res.status(500).json({ error: "Error al obtener los materiales", message: err.message });
        }
    }//cierre de la funcion getMaterialByNombre

    async updateMaterialById(req, res){
        try{

            //console.log('cuerpo de la solicitud', req.body);
            //const materialId = await MaterialModel.findByIdAndUpdate(req.params.id, req.body, {new:true});

            const usuario = req.usuario; //usuario loguedo
            const materialId = req.params.id; // id del material obtenido del parametro
            const { nombre, descripcion, cantidad, ubicacion, movimientos, celda } = req.body; //filtrar cuerpo de la solicitud

            //Buscamos el usuario que contiene ese material
            const userDoc = await UserModel.findById(usuario._id);
            if (!userDoc || !userDoc.almacen || userDoc.almacen.length === 0) {
                return res.status(404).json({error: "No se encontró almacén para el usuario"});
            }

            let materialActualizado = null; //variable para guardar el materiales

            //recorremos estantes, dispositivos y materiales para encontrar y actualizar
            userDoc.almacen[0].estantes.forEach(estante => {
                estante.dispositivos.forEach(dispositivo => {
                    dispositivo.materiales.forEach(material => {
                        if (material._id.toString() === materialId) {
                            // Actualizar los campos
                            if (nombre) material.nombre = nombre;
                            if (descripcion) material.descripcion = descripcion;
                            if (cantidad) material.cantidad = cantidad;
                            if (ubicacion) material.ubicacion = ubicacion;
                            if (movimientos) material.movimientos = movimientos;
                            if (celda !== undefined && celda !== null && celda !== '') {
                                // Convertir a número si es string numérica
                                const nuevaCelda = typeof celda === 'string' ? Number(celda) : celda;
                                if (!Number.isNaN(nuevaCelda)) {
                                    dispositivo.celda = nuevaCelda;
                                }
                            }
                            material.Timestamp = new Date();
                            materialActualizado = material;
                        }
                    });
                });
            });

            //console.log('Esto devuelve la consulta', materialActualizado);

            if(!materialActualizado){
                return res.status(404).json({error:"Material no encontrado"});
            }

            //Guardar el material actualizado en la base de datos
            await userDoc.save();

            res.status(200).json({mensaje:"Material actualizado", material:materialActualizado});

        }catch(err){
            res.status(500).json({error:"Error al actualizar el material", message: err.mensaje})
        }  
    }//cierre de la funcion updateMaterialById

    async deleteMaterialById(req, res){
        try{
            
            const usuario = req.usuario; //usuario loguedo
            const materialId = req.params.id; // id del material obtenido del parametro

            //buscar usuario
            const userDoc = await UserModel.findById(usuario._id);
            if(!userDoc || !userDoc.almacen || userDoc.almacen.length === 0){
                return res.status(404).json({error: "No se encontró almacén para el usuario"});
            }

            let materialEliminado = null;
            let dispositivoEliminado = null;

            userDoc.almacen[0].estantes.forEach(estante => {
                // Usar for clásico para poder eliminar dispositivos si es necesario
                for (let i = estante.dispositivos.length - 1; i >= 0; i--) {
                    const dispositivo = estante.dispositivos[i];
                    const index = dispositivo.materiales.findIndex(
                        material => material._id.toString() === materialId
                    );
                    if (index !== -1) {
                        materialEliminado = dispositivo.materiales[index];
                        dispositivo.materiales.splice(index, 1); // Eliminar el material
                        // Si el dispositivo queda sin materiales, eliminar el dispositivo (celda)
                        if (dispositivo.materiales.length === 0) {
                            dispositivoEliminado = estante.dispositivos[i];
                            estante.dispositivos.splice(i, 1);
                        }
                    }
                }
            });

        if(!materialEliminado){
            return res.status(404).json({error:"Material no encontrado"});
        }

        await userDoc.save();

            res.status(200).json({ 
                mensaje: "Material eliminado", 
                material: materialEliminado,
                dispositivoEliminado: dispositivoEliminado ? dispositivoEliminado : null
            });

        }catch(err){
            res.status(500).json({error:"Error al eliminar el material", message: err.mensaje})
        }

    }//cierre de la funcion deleteMaterialById

}//cierre de la clase MaterialController

module.exports = new MaterialController(); // Exportar una instancia de la clase MaterialController