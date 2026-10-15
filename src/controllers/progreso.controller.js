
const service = require('../services/progreso.service');
const responderError = require('../utils/responderError');

async function obtener(req, res) {
  try {
    const progreso = await service.obtener(req.params.id);
    res.status(200).json(progreso);
  } catch (error) {
    responderError(res, error);
  }
}

module.exports = { obtener };
