const express = require('express');
const router = express.Router();
const LedStatus = require('../../models/IoT/LedStatus');

/* ---------------------------------------------
         ENDPOINTS DE CONTROL DE LEDS
----------------------------------------------*/

// GET /led → Devuelve el estado actual de los 12 LEDs
router.get('/led', async (req, res) => {
  try {
    const leds = await LedStatus.aggregate([
      { $sort: { fecha: -1 } },  // Primero ordena por fecha más reciente
      {
        $group: {                // Luego agrupa por ID del LED
          _id: "$ledId",
          estado: { $first: "$estado" }, // Toma el estado más reciente
          fecha: { $first: "$fecha" }
        }
      },
      { $project: { _id: 0, ledId: "$_id", estado: 1 } }, // Formato limpio
      { $sort: { ledId: 1 } } // Orden ascendente por ID de LED
    ]);
    res.json(leds);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener estados de los LEDs" });
  }
});


// POST /led → Guarda un nuevo estado para un LED
router.post('/led', async (req, res) => {
  const { ledId, estado } = req.body;

  // Validación de datos
  if (ledId === undefined || estado === undefined) {
    return res.status(400).json({ error: "led ID o estado no definido" });
  }

  try {
    const nuevo = new LedStatus({ ledId, estado });
    await nuevo.save();
    res.json({ message: `Estado del LED ${ledId} guardado`, estado });
  } catch (err) {
    res.status(500).json({ error: "Error al guardar estado del LED" });
  }
});


// DELETE /led/:ledId → Elimina todos los registros de ese LED (y también los null)
router.delete('/led/:ledId', async (req, res) => {
  const { ledId } = req.params;

  try {
    const conditions = [
      { ledId: parseInt(ledId) },  // Eliminar por ID
      { ledId: null }              // Eliminar registros inválidos
    ];

    const result = await LedStatus.deleteMany({ $or: conditions });

    res.json({
      message: `LED ${ledId} eliminado correctamente`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar el LED" });
  }
});

module.exports = router;
