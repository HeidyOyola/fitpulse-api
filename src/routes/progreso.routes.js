const { Router } = require('express');
const controller = require('../controllers/progreso.controller');

const router = Router();

// Consultar el progreso de un usuario
router.get('/usuarios/:id/progress', controller.obtener);

module.exports = router;


