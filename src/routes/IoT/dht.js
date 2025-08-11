const express = require('express');
const router = express.Router();
const DhtData = require('../../models/IoT/DhtData');

/* ---------------------------------------------
          ENDPOINTS DEL SENSOR DHT11
----------------------------------------------*/

// POST /dht → Guarda una lectura de temperatura y humedad
router.post('/dht', async (req, res) => {
  const { temperatura, humedad } = req.body;

  if (temperatura === undefined || humedad === undefined) {
    return res.status(400).json({ error: "Datos incompletos (temperatura o humedad faltan)" });
  }

  try {
    const nuevoDato = new DhtData({ temperatura, humedad });
    await nuevoDato.save();
    res.json({ message: "Datos del sensor guardados", temperatura, humedad });
  } catch (err) {
    res.status(500).json({ error: "Error al guardar datos del sensor" });
  }
});


// GET /dht → Devuelve la última lectura registrada del sensor
router.get('/dht', async (req, res) => {
  try {
    const ultimo = await DhtData.findOne().sort({ createdAt: -1 });  // Obtener la última
    if (!ultimo) return res.status(404).json({ error: "No hay datos del sensor" });
    res.json(ultimo);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener datos del sensor" });
  }
});


// GET /dht/historial → Devuelve todas las lecturas del sensor (completo o filtrado)
router.get('/dht/historial', async (req, res) => {
  try {
    const { modo, desde: desdeParam, hasta: hastaParam } = req.query;
    let desde, hasta;

    // Si hay fechas personalizadas, se usan
    if (desdeParam) desde = new Date(desdeParam);
    if (hastaParam) hasta = new Date(hastaParam);

    // Si no hay fechas personalizadas pero hay modo, se calcula automáticamente
    if (!desde && modo) {
      const ahora = new Date();
      switch (modo) {
        case "dia":
          desde = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
          break;
        case "semana":
          desde = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() - 6);
          break;
        case "mes":
          desde = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
          break;
        case "año":
          desde = new Date(ahora.getFullYear(), 0, 1);
          break;
      }
    }

    // Construir filtro si hay fechas
    const filtro = {};
    if (desde) filtro.createdAt = { ...filtro.createdAt, $gte: desde };
    if (hasta) filtro.createdAt = { ...filtro.createdAt, $lte: hasta };

    // Ejecutar consulta: con filtro si existe, o todo el historial
    const historial = await DhtData.find(filtro).sort({ createdAt: -1 });

    res.json(historial);
  } catch (err) {
    console.error("Error al obtener historial del sensor:", err);
    res.status(500).json({ error: "Error al obtener historial del sensor" });
  }
});


module.exports = router;
