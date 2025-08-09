const express = require('express');
const router = express.Router();
const ServoStatus = require('../../models/IoT/ServoStatus');

/* ---------------------------------------------
              ENDPOINTS DEL SERVO
----------------------------------------------*/

// GET /servo → Último ángulo guardado
router.get('/servo', async (req, res) => {
  try {
    const ultimo = await ServoStatus.findOne().sort({ fecha: -1 });
    if (!ultimo) return res.status(404).json({ error: "No hay estado del servo" });
    res.json({ angulo: ultimo.angulo });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener estado del servo" });
  }
});

// POST /servo → Guardar nuevo ángulo
router.post('/servo', async (req, res) => {
  const { angulo } = req.body;

  if (angulo === undefined || angulo < 0 || angulo > 180) {
    return res.status(400).json({ error: "Ángulo inválido (0 a 180 requerido)" });
  }

  try {
    const nuevo = new ServoStatus({ angulo });
    await nuevo.save();
    res.json({ message: `Ángulo del servo actualizado a ${angulo}°` });
  } catch (err) {
    res.status(500).json({ error: "Error al guardar ángulo del servo" });
  }
});


module.exports = router;
