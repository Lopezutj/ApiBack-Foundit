const AlmacenModel = require('../models/AlmacenModel');
const UserModel = require('../models/UserModel');


//controlador de Almacen
class AlmacenController{
    constructor(){}// Constructor vacío para la clase AlmacenController como POO

    // funcion del tipo POST para crear un nuevo almacen del usuario autenticado
    async create(req,res){

        try{
            //console.log('Datos del cuerpo de la solicitud:', req.body);
            const usuario = req.usuario;
            //console.log('Usuario autenticado:', usuario);
            const _id = usuario._id;
            // Verificar permisos
            if (usuario.tipo !== 'admin') {
                console.log('Usuario no tiene permisos para crear un almacén');
                return res.status(403).json({ error: "No tienes permisos para crear un almacén" });
            }
            if(!_id){
                console.log('ID del usuario no proporcionado');
                return res.status(400).json({ error: "ID del usuario requerido" });
            }
            if (!req.body.direccion || !req.body.name) {
                console.log('Faltan datos requeridos para crear el almacén:', req.body);
                return res.status(400).json({ error: "Faltan datos requeridos para crear el almacén" });
            }
            // Crear el almacén
            const updateUser = await UserModel.findByIdAndUpdate(
                _id,
                { $push: { almacen: req.body } },
                { new: true }
            );
            //console.log('Resultado de findByIdAndUpdate:', updateUser);
            if (!updateUser) {
                console.log('Usuario no encontrado al crear el almacén');
                return res.status(404).json({ error: "Usuario no encontrado" });
            }
            const newAlmacen = updateUser.almacen[updateUser.almacen.length - 1];
            //console.log('Nuevo almacén agregado:', newAlmacen);
            res.status(201).json({
                mensaje: "Almacen creado y asociado al usuario",
                almacen: newAlmacen,
                usuarioId: updateUser._id,
                _id: newAlmacen._id
            });
        }catch (err){
            console.error('Error en create Almacen:', err);
            res.status(500).json({ error: "Error al crear el almacen", message: err.message });
        }

    }// Crear un nuevo almacen  

    //funcion del tipo get para obtener un almacen por ID
    async createAlmacenById(req, res) {
        console.log('Crear almacén por ID del usuario:', req.params.id); // Verificar el ID del usuario recibido

        try{
            
            //verificar si el usuario autenticado es admin
            const usuario = req.usuario; // Obtener el usuario autenticado
            if (usuario.tipo !== 'admin') {
                return res.status(403).json({ error: "No tienes permisos para crear un almacén" });
            }
            // Validar que se proporcione el ID del usuario
            if (!req.params.id) {
                return res.status(400).json({ error: "ID del usuario requerido" });
            }
            // Validar datos del cuerpo de la solicitud
            if (!req.body || !req.body.name || !req.body.direccion) {
                return res.status(400).json({ error: "Datos para crear el almacén requeridos" });
            }

            // Buscar el usuario por ID
            const usuarioEncontrado = await UserModel.findById(req.params.id);
            if (!usuarioEncontrado) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            //console.log('Usuario encontrado:', usuarioEncontrado); // Verificar el usuario encontrado
            
            //actualizar el usuario con el nuevo almacen
            const updateUser = await UserModel.findByIdAndUpdate(
                usuarioEncontrado._id,
                { $push: { almacen: req.body } },
                { new: true }
            );
            const nuevoAlmacen = updateUser.almacen[updateUser.almacen.length - 1]; // Obtener el último almacén agregado

            res.status(201).json({
                mensaje: "Almacén creado y asociado al usuario",
                almacen: nuevoAlmacen,
                usuarioId: usuarioEncontrado._id,
                _id: nuevoAlmacen._id // Devolver el ID del nuevo almacén
            });
        }catch(err){
            res.status(400).json({ error: "Error al crear el almacen por ID", message: err.message });
        }
    }

    

    async getAlmacenAll(req, res) {
        try {
            const usuario = req.usuario; // Usuario autenticado
            if (usuario.tipo !== 'admin') {
                return res.status(403).json({ error: "No tienes permisos para ver los almacenes" });
            }
            // Buscar todos los almacenes del usuario autenticado
            const usuariosConAlmacenes = await UserModel.find({
                _id: usuario._id,
                'almacen.0': { $exists: true }
            }, 'almacen');
            let todosLosAlmacenes = [];
            usuariosConAlmacenes.forEach(usuario => {
                todosLosAlmacenes = todosLosAlmacenes.concat(usuario.almacen);
            });
            if (!todosLosAlmacenes || todosLosAlmacenes.length === 0) {
                return res.status(404).json({ error: "No se encontraron almacenes" });
            }
            // Obtener todos los operadores con sus almacenes y nombre
            const operadores = await UserModel.find(
                { tipo: 'operador', 'almacen.0': { $exists: true } },
                'almacen name'
            );
            // Mapeo para asociar trabajadores a cada almacén (clave normalizada)
            const trabajadoresPorAlmacen = {};
            operadores.forEach(usuario => {
                if (Array.isArray(usuario.almacen)) {
                    usuario.almacen.forEach(almacen => {
                        const nombre = (almacen.name || almacen.nombre || '').toLowerCase().trim();
                        if (nombre) {
                            if (!trabajadoresPorAlmacen[nombre]) {
                                trabajadoresPorAlmacen[nombre] = [];
                            }
                            trabajadoresPorAlmacen[nombre].push(usuario.name);
                        }
                    });
                }
            });
            // Normalizar todos los almacenes para que siempre tengan 'name'
            const almacenesNormalizados = todosLosAlmacenes.map(almacen => ({
                _id: almacen._id,
                name: almacen.name || almacen.nombre || '',
                direccion: almacen.direccion,
                Timestamp: almacen.Timestamp,
                estantes: almacen.estantes || []
            }));
            //console.log('Todos los almacenes:', almacenesNormalizados);
            res.status(200).json({
                mensaje: "Almacenes encontrados",
                almacenes: almacenesNormalizados,
                total: almacenesNormalizados.length,
                trabajadoresPorAlmacen
            });
        } catch (err) {
            res.status(400).json({ error: "Error al obtener los almacenes", message: err.message });
        }
    }

    
    //funcion del tipo get para filtrar un almacen por nombres
    async getAlmacenName(req, res){

        try{   

            let nombreAlmacen = req.params.name; // Obtener el nombre del almacén desde los parámetros de la solicitud

            //console.log('Nombre del almacén:', nombreAlmacen); // Verificar el nombre del almacén

            if(!nombreAlmacen){
                return res.status(403).json({ error: "Falta el nombre del almacén" });
            }

            if(!nombreAlmacen.match(/^[a-zA-Z0-9\s]+$/)){ // Validar que el nombre del almacén solo contenga letras, números y espacios
                return res.status(422).json({ error: "El nombre del almacén contiene caracteres no válidos" });
            }

            const usuarios = await UserModel.find({
                "almacen.name": {$regex: nombreAlmacen, $options: "i"} // Buscar almacenes por nombre (insensible a mayúsculas y minúsculas)
            }, 'almacen'); // Obtener usuarios que tienen almacenes con el nombre especificado
            
            //extraer los almacenes de los usuarios
            let almacenesEncontrados = [];
            usuarios.forEach(usuario => { //recorrer cada usuario
                if (usuario.almacen && usuario.almacen.name.toLowerCase().includes(nombreAlmacen.toLowerCase())) {
                    almacenesEncontrados.push(usuario.almacen); // Agregar el almacén si coincide
                }
            });

            if (almacenesEncontrados.length === 0) {
                return res.status(404).json({ error: "No se encontraron almacenes con ese nombre" });
            }

            res.status(200).json({
                mensaje: "Almacenes encontrados por nombre",
                almacenes: almacenesEncontrados.map(almacen => ({ //mapear los almacenes para devolver solo los campos necesarios
                    _id: almacen._id,
                    name: almacen.name,
                    direccion: almacen.direccion,
                    Timestamp: almacen.Timestamp
                })),
                total: almacenesEncontrados.length //total en numeros
            });

        }catch(err){
            res.status(400).json({error: "Error al obtener el almacen por el nombre", message: err.message});
        }
    }//cierre la función getAlmacenName

    //funcion del tipo put para actualizar un almacen por ID
    async updateAlmacenById(req, res){
        try{
            // Obtener el usuario autenticado
            const usuario = req.usuario;
            //console.log('Usuario del token:', usuario); // Ver qué contiene el token
            //console.log('ID del usuario:', usuario._id); // Ver el ID específico    
            
            // Verificar permisos (solo admin o el propietario puede actualizar)
            if (usuario.tipo !== 'admin') {
                return res.status(403).json({ error: "No tienes permisos para actualizar almacenes" });
            }

            // Validar que se proporcione el ID del almacén
            if (!req.params.id) {
                return res.status(400).json({ error: "ID del almacén requerido" });
            }

            // Validar datos del cuerpo de la solicitud
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ error: "Datos para actualizar requeridos" });
            }

            // Buscar el usuario que contiene el almacén
            const usuarioConAlmacen = await UserModel.findOne({
                "almacen._id": req.params.id
            });

            if (!usuarioConAlmacen) {
                return res.status(404).json({ error: "Almacén no encontrado" });
            }

            // Encontrar el índice del almacén en el array
            const almacenIndex = usuarioConAlmacen.almacen.findIndex(
                almacen => almacen._id.toString() === req.params.id // Comparar como cadena para evitar problemas de tipo ObjectId
            );

            if (almacenIndex === -1) {  // Verificar si el almacén existe en el array
                return res.status(404).json({ error: "Almacén no encontrado" });
            }

            // Preparar los campos a actualizar
            const camposActualizar = {};
            if (req.body.name) camposActualizar[`almacen.${almacenIndex}.name`] = req.body.name;
            if (req.body.direccion) camposActualizar[`almacen.${almacenIndex}.direccion`] = req.body.direccion;
            
            // Actualizar timestamp
            camposActualizar[`almacen.${almacenIndex}.Timestamp`] = new Date();

            // Actualizar el almacén específico
            const usuarioActualizado = await UserModel.findByIdAndUpdate(
                usuarioConAlmacen._id, // ID del usuario que contiene el almacén
                { $set: camposActualizar },  //insertamos los campos a actualizar
                { new: true,runValidators: true } // Devolver el documento actualizado y aplicar validaciones 
            );

            // Obtener el almacén actualizado
            const almacenActualizado = usuarioActualizado.almacen.find(
                almacen => almacen._id.toString() === req.params.id
            );

            res.status(200).json({ 
                mensaje: "Almacén actualizado correctamente", 
                almacen: {
                    _id: almacenActualizado._id,
                    name: almacenActualizado.name,
                    direccion: almacenActualizado.direccion,
                    Timestamp: almacenActualizado.Timestamp
                }
            });

        }catch (err){
            res.status(500).json({error: "Error al actualizar el almacén", message: err.message });
        }
    }//cierre la función updateAlmacenById

    //funcion del tipo delete para eliminar un almacen por ID
    async deleteAlmacenById(req, res){
        try{

            let _id = req.params.id; // Obtener el ID del almacén desde los parámetros de la solicitud
            let usuario = req.usuario; // Obtener el usuario autenticado

            if(usuario.tipo !== 'admin'){
                return res.status(403).json({ error: "No tienes permisos para eliminar almacenes" });
            }

            if(!_id){
                return res.status(400).json({ error: "ID del almacén requerido" });
            }

            // Primero verificar que el almacén existe
            const usuarioConAlmacen = await UserModel.findOne({
                "almacen._id": _id
            });

            if (!usuarioConAlmacen) {
                return res.status(404).json({ error: "Almacén no encontrado" });
            }

            // Eliminar el almacén embebido usando $unset
            const resultado = await UserModel.findByIdAndUpdate(
                usuarioConAlmacen._id,
                { $unset: { almacen: "" } }, // Eliminar el almacén embebido
                { new: true }
            );

            //console.log('Resultado de eliminación:', resultado ? 'Almacén eliminado correctamente' : 'Error al eliminar'); 
            
            if (!resultado) {
                return res.status(500).json({ error: "Error al eliminar el almacén" });
            }

            res.status(200).json({ 
                mensaje: "Almacén eliminado correctamente",
                almacenId: _id
            });
        }catch (err){
            res.status(400).json({ error: "Error al eliminar el almacen", message: err.message });
        }
    }//cierre la función deleteAlmacenById


}//cierre la clase AlmacenController

module.exports = new AlmacenController(); // Exportar una instancia de AlmacenController