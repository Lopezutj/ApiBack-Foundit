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
        if(!req.body.celda || !req.body.materiales){
            return res.status(401).json({error: "Faltan datos requeridos para crear el dispositivo"});
        }


        //creamos el dispositivo y agregamos el material 
        try{
            
            //console.log('Usuario del token:', usuario); // Ver qué contiene el token
            //console.log('ID del usuario:', usuario._id); // Ver el ID específico
            //console.log('Datos del cuerpo:', req.body); // Ver los datos del dispositivo que se están creando

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

        //console.log('Documento actualizado:', updateDispositivo);
        //console.log('Dispositivos:', updateDispositivo.almacen[0].estantes[0].dispositivos);

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