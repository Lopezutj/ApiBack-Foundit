const UserModel = require('../models/UserModel');
const DispositivoModel = require('../models/DispositivoModel'); // Importar el modelo de Dispositivo

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

            // Agregar el dispositivo al estante específico
            const updateDispositivo = await UserModel.findByIdAndUpdate(
                usuario._id,
                { $push: { "almacen.estantes.$[estante].dispositivos": {
                    celda: req.body.celda,
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

    // Endpoints para el ESP32
    
    // POST /api/dht
// Recibe los datos de temperatura y humedad del ESP32 y los guarda en la BD, copiando el estado actual de LED y servo
async receiveDHT(req, res) {
    const { temperature, humidity } = req.body;
    try {
        // Encuentra el último registro para copiar led y servo
        const last = await DispositivoModel.findOne().sort({ timestamp: -1 });
        const lastLed = last ? last.led : { ledId: -1, state: 'off' };
        const lastServo = last ? last.servo : { position: 0 };

        // Crea un nuevo registro con los datos DHT y copia led/servo
        await DispositivoModel.create({
            temperature,
            humidity,
            led: lastLed,
            servo: lastServo
        });

        console.log(`Datos DHT recibidos: Temp=${temperature}, Hum=${humidity}`);
        res.status(200).json({ status: 'ok', message: 'DHT data received' });
    } catch (error) {
        console.error('Error al guardar datos DHT:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
}

// GET /api/dht
// Envía solo los últimos datos de temperatura y humedad al frontend
async getLatestDHT(req, res) {
    try {
        const latestData = await DispositivoModel.findOne().sort({ timestamp: -1 });
        if (latestData) {
            res.status(200).json({
                temperature: latestData.temperature,
                humidity: latestData.humidity
            });
        } else {
            res.status(200).json({ temperature: null, humidity: null });
        }
    } catch (error) {
        console.error('Error al obtener últimos datos DHT:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
}

// POST /api/led/control
// Recibe un comando del frontend para controlar el LED y lo guarda en la BD
async controlLed(req, res) {
    const { ledId, state } = req.body;
    try {
        const latestData = await DispositivoModel.findOne().sort({ timestamp: -1 });
        if (latestData) {
            latestData.led = { ledId, state };
            await latestData.save();
            console.log(`Comando para LED recibido: ledId=${ledId}, state=${state}`);
            res.status(200).json({ status: 'ok', message: 'Led command received' });
        } else {
            await DispositivoModel.create({ led: { ledId, state } });
            res.status(200).json({ status: 'ok', message: 'Led command received' });
        }
    } catch (error) {
        console.error('Error al guardar comando de LED:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
}

// GET /api/led/status
// Envía el estado del LED al ESP32
async getLedStatus(req, res) {
    try {
        const latestData = await DispositivoModel.findOne().sort({ timestamp: -1 });
        if (latestData && latestData.led) {
            res.status(200).json(latestData.led);
        } else {
            res.status(200).json({ ledId: -1, state: 'off' });
        }
    } catch (error) {
        console.error('Error al obtener estado de LED:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
}

// POST /api/servo/control
// Recibe un comando del frontend para controlar el servo y lo guarda en la BD
async controlServo(req, res) {
    const { position } = req.body;
    try {
        const latestData = await DispositivoModel.findOne().sort({ timestamp: -1 });
        if (latestData) {
            latestData.servo = { position };
            await latestData.save();
            console.log(`Comando para Servo recibido: position=${position}`);
            res.status(200).json({ status: 'ok', message: 'Servo command received' });
        } else {
            await DispositivoModel.create({ servo: { position } });
            res.status(200).json({ status: 'ok', message: 'Servo command received' });
        }
    } catch (error) {
        console.error('Error al guardar comando de servo:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
}

// GET /api/servo/status
// Envía la posición del servo al ESP32
async getServoStatus(req, res) {
    try {
        const latestData = await DispositivoModel.findOne().sort({ timestamp: -1 });
        if (latestData && latestData.servo) {
            res.status(200).json(latestData.servo);
        } else {
            res.status(200).json({ position: 0 });
        }
    } catch (error) {
        console.error('Error al obtener posición del servo:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
}

}//cierre la clase DispositivoController

module.exports = new DispositivoController(); // Exportar una instancia de la clase DispositivoController