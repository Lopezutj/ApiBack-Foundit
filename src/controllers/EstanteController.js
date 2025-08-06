const AlmacenModel = require('../models/AlmacenModel');
const EstanteModel = require('../models/EstanteModel');
const UserModel = require('../models/UserModel');

class EstanteController{
    constructor(){}//constructor vacío para la clase EstanteController como POO

    //funcion del tipo POST para crear un nuevo estante
    async create(req,res){

        //obtenemos el usuario que está creando el estante
        let usuarioToken = req.usuario; // usuario autenticado por token
        let usuarioId = req.params.id; // id del usuario en la URL

        //verificar si el usuario autenticado es admin
        if(usuarioToken.tipo !== 'admin'){
            return res.status(403).json({error: "No tienes permisos para crear un estante"});
        }

        //validar datos del body
        if(!req.body.nombre || !req.body.nameDispositivo || !req.body.ip || !req.body.almacenId){
            return res.status(400).json({error: "Faltan datos requeridos para crear el estante (nombre, nameDispositivo, ip, almacenId)"});
        }

        //validar id del usuario de la URL
        if(!usuarioId){
            return res.status(400).json({error: "ID de usuario requerido en la URL"});
        }

        try {
            // Buscar el usuario por el id de la URL
            const usuarioConAlmacen = await UserModel.findById(usuarioId);
            if (!usuarioConAlmacen) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }
            // Buscar el almacén dentro del usuario
            const almacenIndex = usuarioConAlmacen.almacen.findIndex(
                almacen => almacen._id.toString() === req.body.almacenId
            );
            if (almacenIndex === -1) {
                return res.status(404).json({ error: "Almacén no encontrado para este usuario" });
            }
            // Crear objeto estante sin el almacenId
            const { almacenId, ...estanteData } = req.body;
            // Agregar el estante al almacén específico
            const updateEstante = await UserModel.findByIdAndUpdate(
                usuarioId,
                { $push: { [`almacen.${almacenIndex}.estantes`]: estanteData } },
                { new: true }
            );
            if (!updateEstante) {
                return res.status(404).json({ error: "Error al agregar el estante" });
            }
            const almacenActualizado = updateEstante.almacen[almacenIndex];
            const newEstante = almacenActualizado.estantes[almacenActualizado.estantes.length - 1];
            res.status(201).json({
                mensaje: "Estante creado y asociado al almacén",
                estante: newEstante,
                almacenId: req.body.almacenId,
                usuarioId: usuarioId
            });
        } catch (err) {
            res.status(500).json({ error: "Error al crear el estante", message: err.message });
        }

    }//cierre la función create

    //funcion para obtener todos los estantes
    async getAllEstantes(req,res){
        try{
            // Buscar usuarios que tengan almacenes con estantes
            const usuariosConEstantes = await UserModel.find({
                "almacen.estantes.0": { $exists: true }
            }, 'almacen');

            if(usuariosConEstantes.length === 0){
                return res.status(404).json({error: "No se encontraron estantes"});
            }

            // Extraer todos los estantes de todos los almacenes
            let todosLosEstantes = []; //inicializar el array
            usuariosConEstantes.forEach(usuario => { //recorremos los usuarios que tienen almacenes
                usuario.almacen.forEach(almacen => { //recorremos los almacenes de cada usuario
                    if(almacen.estantes && almacen.estantes.length > 0) { //validar si hay estantes en el almacén
                        almacen.estantes.forEach(estante => { //recorremos los estantes del almacén
                            todosLosEstantes.push({ // Agregar el estante al array
                                _id: estante._id,
                                name: estante.name,
                                nameDispositivo: estante.nameDispositivo,
                                ip: estante.ip,
                                Timestamp: estante.Timestamp,
                                almacenId: almacen._id,
                                almacenName: almacen.name,
                                dispositivo: estante.dispositivo || []
                            });
                        });
                    }
                });
            });

            if(todosLosEstantes.length === 0){
                return res.status(404).json({error: "No se encontraron estantes"});
            }

            res.status(200).json({
                mensaje: "Estantes encontrados",
                estantes: todosLosEstantes,
                total: todosLosEstantes.length
            });
        }
        catch(err){
            res.status(500).json({error: "Error al obtener los estantes", message: err.message});
        }
    }//cierre la función getAllEstantes

    //funcion para actualizar un estante por ID
    async updateEstanteById(req,res){
        try{
            // Obtener el usuario autenticado
            const usuario = req.usuario;
            
            // Verificar permisos
            if (usuario.tipo !== 'admin') {
                return res.status(403).json({ error: "No tienes permisos para actualizar estantes" });
            }

            // Validar que se proporcione el ID del estante
            if (!req.params.id) {
                return res.status(400).json({ error: "ID del estante requerido" });
            }

            // Validar datos del cuerpo de la solicitud
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ error: "Datos para actualizar requeridos" });
            }

            // Buscar el usuario que contiene el estante
            const usuarioConEstante = await UserModel.findOne({
                "almacen.estantes._id": req.params.id
            });

            if (!usuarioConEstante) {
                return res.status(404).json({ error: "Estante no encontrado" });
            }

            // Encontrar índices del almacén y estante
            let almacenIndex = -1;
            let estanteIndex = -1;
            
            usuarioConEstante.almacen.forEach((almacen, aIndex) => {
                const eIndex = almacen.estantes.findIndex(
                    estante => estante._id.toString() === req.params.id
                );
                if (eIndex !== -1) {
                    almacenIndex = aIndex;
                    estanteIndex = eIndex;
                }
            });

            if (almacenIndex === -1 || estanteIndex === -1) {
                return res.status(404).json({ error: "Estante no encontrado" });
            }

            // Preparar campos a actualizar
            const camposActualizar = {};
            if (req.body.name) camposActualizar[`almacen.${almacenIndex}.estantes.${estanteIndex}.name`] = req.body.name;
            if (req.body.nameDispositivo) camposActualizar[`almacen.${almacenIndex}.estantes.${estanteIndex}.nameDispositivo`] = req.body.nameDispositivo;
            if (req.body.ip) camposActualizar[`almacen.${almacenIndex}.estantes.${estanteIndex}.ip`] = req.body.ip;
            
            // Actualizar timestamp
            camposActualizar[`almacen.${almacenIndex}.estantes.${estanteIndex}.Timestamp`] = new Date();

            // Actualizar el estante
            const usuarioActualizado = await UserModel.findByIdAndUpdate(
                usuarioConEstante._id,
                { $set: camposActualizar },
                { new: true, runValidators: true }
            );

            // Obtener el estante actualizado
            const estanteActualizado = usuarioActualizado.almacen[almacenIndex].estantes[estanteIndex];

            res.status(200).json({
                mensaje: "Estante actualizado correctamente",
                estante: {
                    _id: estanteActualizado._id,
                    name: estanteActualizado.name,
                    nameDispositivo: estanteActualizado.nameDispositivo,
                    ip: estanteActualizado.ip,
                    Timestamp: estanteActualizado.Timestamp
                }
            });

        }
        catch(err){
            res.status(500).json({error: "Error al actualizar el estante", message: err.message});
        }
    }
    //cierre la función updateEstanteById

    //funcion para eliminar un estante por ID
    async deleteEstanteById(req,res){
        try{
            // Obtener el usuario autenticado
            const usuario = req.usuario;
            
            // Verificar permisos
            if (usuario.tipo !== 'admin') {
                return res.status(403).json({ error: "No tienes permisos para eliminar estantes" });
            }

            // Validar que se proporcione el ID del estante
            if (!req.params.id) {
                return res.status(400).json({ error: "ID del estante requerido" });
            }

            // Buscar el usuario que contiene el estante
            const usuarioConEstante = await UserModel.findOne({
                "almacen.estantes._id": req.params.id
            });

            if (!usuarioConEstante) {
                return res.status(404).json({ error: "Estante no encontrado" });
            }

            // Encontrar índices del almacén y estante
            let almacenIndex = -1;
            
            usuarioConEstante.almacen.forEach((almacen, aIndex) => {
                const eIndex = almacen.estantes.findIndex(
                    estante => estante._id.toString() === req.params.id
                );
                if (eIndex !== -1) {
                    almacenIndex = aIndex;
                }
            });

            if (almacenIndex === -1) {
                return res.status(404).json({ error: "Estante no encontrado" });
            }

            // Eliminar el estante usando $pull
            const resultado = await UserModel.findByIdAndUpdate(
                usuarioConEstante._id,
                { $pull: { [`almacen.${almacenIndex}.estantes`]: { _id: req.params.id } } },
                { new: true }
            );

            if (!resultado) {
                return res.status(500).json({ error: "Error al eliminar el estante" });
            }

            res.status(200).json({
                mensaje: "Estante eliminado correctamente",
                estanteId: req.params.id
            });

        }
        catch(err){
            res.status(500).json({error: "Error al eliminar el estante", message: err.message});
        }
        }
    //cierre la función deleteEstanteById   


}//cierre la clase EstanteController

module.exports = new EstanteController(); // Exportar una instancia de la clase EstanteController