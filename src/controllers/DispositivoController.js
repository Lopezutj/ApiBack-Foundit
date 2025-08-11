const DispositivoModel = require('../models/DispositivoModel');
const MaterialModel = require('../models/MaterialModel');
const UserModel = require('../models/UserModel');

//controlador de Dispositivo
class DispositivoController{
    constructor(){}//constructor vacío para la clase DispositivoController como POO

    //funcion del tipo POST para crear un nuevo dispositivo
    async create(req,res){

        let usuario = req.usuario; // Asumiendo que el middleware de autenticación ha agregado el usuario a la solicitud

        //validamos el id del usuario logueado
        if(!usuario._id){
            return res.status(401).json({error: "Usuario no entrado o no existe"});
        }
        console.log('Cuerpo de la solicitud:', req.body); // Ver qué datos se están enviando en la solicitud

        //validamos los datos que vienen en el cuerpo de la solicitud
        if(!req.body.celda || !req.body.material){
            return res.status(401).json({error: "Faltan datos requeridos para crear el dispositivo (celda, material)"});
        }

        //creamos el dispositivo y agregamos el material 
        try{
            
            // Necesitamos el almacenId y estanteId para agregar el dispositivo
            if(!req.body.almacenId || !req.body.estanteId){
                return res.status(400).json({error: "Faltan almacenId y estanteId para crear el dispositivo"});
            }

            // Buscar el usuario que contiene el almacén y estante
            const usuarioConAlmacen = await UserModel.findOne({
                _id: usuario._id,
                "almacen._id": req.body.almacenId
            });

            if (!usuarioConAlmacen) {
                return res.status(404).json({ error: "Almacén no encontrado o no pertenece al usuario" });
            }

            // Verificar que el estante existe
            const estante = usuarioConAlmacen.almacen.estantes.find(
                estante => estante._id.toString() === req.body.estanteId
            );

            if (!estante) {
                return res.status(404).json({ error: "Estante no encontrado" });
            }

            // Agregar el dispositivo al estante específico (AGREGAR EL LED AL ESTANTE)
            const updateDispositivo = await UserModel.findByIdAndUpdate(
                usuario._id,
                { $push: { "almacen.estantes.$[estante].dispositivos": {
                    celda: req.body.celda,
                    led: false, // Estado inicial del LED apagado 
                    material: req.body.material
                }}},
                { 
                    arrayFilters: [{ "estante._id": req.body.estanteId }],
                    new: true 
                }
            );

            if(!updateDispositivo.almacen.estantes){
                return res.status(404).json({error: "Error al agregar el dispositivo"});
            }

            const estanteActualizado = updateDispositivo.almacen.estantes.find(
                estante => estante._id.toString() === req.body.estanteId
            );
            const newDispositivo = estanteActualizado.dispositivos[estanteActualizado.dispositivos.length - 1];
            const newMaterial = newDispositivo.material;

        res.status(201).json({
            mensaje: "Dispositivo y material creados y asociados al usuario",
            dispositivo: newDispositivo,
            material: newMaterial,
            usuarioId: usuario._id
        });

        }catch(err){
            return res.status(500).json({error: "Error al crear el dispositivo", message: err.message});
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

    //funcion para obtener el estado del LED por celda
    async getLedByCelda(req, res) {
            const { celda } = req.params; 
        try {
            const usuario = await UserModel.findOne({ "almacen.estantes.dispositivos.celda": parseInt(celda) }); 
            if (!usuario) {
                return res.status(404).json({ error: "Celda no encontrada" });
        }

            const dispositivo = usuario.almacen.estantes 
            .flatMap(est => est.dispositivos) // Aplanar el array de dispositivos
            .find(d => d.celda === parseInt(celda)); // Buscar el dispositivo por celda

            if (!dispositivo) {
              return res.status(404).json({ error: "Dispositivo no encontrado en la celda" });
          }

            res.status(200).json({ celda, led: dispositivo.led }); 
        } catch (err) {
            res.status(500).json({ error: "Error al obtener el estado del LED", message: err.message });
       }
    }//cierre la función getLedByCelda

    //funcion para actualizar el estado del LED por celda
    async updateLedByCelda(req, res) {
            const { celda } = req.params;
            const { led } = req.body;

            if (led === undefined) {
                return res.status(400).json({ error: "Falta el estado del LED" });
        }  

        try {
            const usuarioActualizado = await UserModel.findOneAndUpdate( 
            { "almacen.estantes.dispositivos.celda": parseInt(celda) }, 
        {$set: {"almacen.estantes.$[].dispositivos.$[disp].led": led}},    
        
        {
        arrayFilters: [{ "disp.celda": parseInt(celda) }], // Filtrar los dispositivos por celda
        new: true
        });

            if (!usuarioActualizado) { 
                return res.status(404).json({ error: "Celda no encontrada" });
           }

           res.status(200).json({ mensaje: `LED actualizado en celda ${celda}`, led });
        } 
        catch (err) {
           res.status(500).json({ error: "Error al actualizar el LED", message: err.message });
           }
    }//cierre la función updateLedByCelda


}//cierre la clase DispositivoController

module.exports = new DispositivoController(); // Exportar una instancia de la clase DispositivoController