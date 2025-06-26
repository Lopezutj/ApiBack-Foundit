const express = require('express');
const router = express.Router();
const MaterialController = require('../controllers/MaterialController');

router.post('/', MaterialController.create);
router.get('/:id', MaterialController.getMaterialById);
router.get('/', MaterialController.getMaterialByNombre);
router.put('/:id', MaterialController.updateMaterialById);
router.delete('/:id', MaterialController.deleteMaterialById);

module.exports = router;