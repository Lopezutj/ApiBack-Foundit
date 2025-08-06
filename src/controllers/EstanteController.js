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
        if(!req.body.nombre || !req.body.nombreDispositivo || !req.body.ip || !req.body.almacenId){
            return res.status(400).json({error: "Faltan datos requeridos para crear el estante (nombre, nombreDispositivo, ip, almacenId)"});
        }

        //validamos id del usuario
        if(!usuario._id){
            return res.status(401).json({error: "Usuario no entrado o no existe"});
        }

        //creamos el estante 
        try {
            // Buscar el usuario que contiene el almacén
            const usuarioConAlmacen = await UserModel.findOne({
                _id: usuario._id,
                "almacen._id": req.body.almacenId
            });

            if (!usuarioConAlmacen) {
                return res.status(404).json({ error: "Almacén no encontrado o no pertenece al usuario" });
            }

            // Verificar que el almacén existe y coincide con el ID
            if (!usuarioConAlmacen.almacen || usuarioConAlmacen.almacen._id.toString() !== req.body.almacenId) {
                return res.status(404).json({ error: "Almacén no encontrado" });
            }

            // Crear objeto estante sin el almacenId
            const { almacenId, ...estanteData } = req.body;

            // Agregar el estante al almacén (objeto único)
            const updateEstante = await UserModel.findByIdAndUpdate(
                usuario._id,
                { $push: { "almacen.estantes": estanteData } },
                { new: true }
            );

            if (!updateEstante) {
                return res.status(404).json({ error: "Error al agregar el estante" });
            }

            const almacenActualizado = updateEstante.almacen;
            const newEstante = almacenActualizado.estantes[almacenActualizado.estantes.length - 1];

            res.status(201).json({
                mensaje: "Estante creado y asociado al almacén",
                estante: newEstante,
                almacenId: req.body.almacenId,
                usuarioId: usuario._id
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
                if(usuario.almacen && usuario.almacen.estantes && usuario.almacen.estantes.length > 0) { //validar si hay estantes en el almacén
                    usuario.almacen.estantes.forEach(estante => { //recorremos los estantes del almacén
                        todosLosEstantes.push({ // Agregar el estante al array
                            _id: estante._id,
                            nombre: estante.nombre,
                            nombreDispositivo: estante.nombreDispositivo,
                            ip: estante.ip,
                            Timestamp: estante.Timestamp,
                            almacenId: usuario.almacen._id,
                            almacenName: usuario.almacen.nombre,
                            dispositivos: estante.dispositivos || []
                        });
                    });
                }
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