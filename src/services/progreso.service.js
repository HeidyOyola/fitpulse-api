
const repository = require('../repositories/progreso.repository');
const usuariosRepository = require('../repositories/usuarios.repository');
const HttpError = require('../utils/httpError');
const { validarId } = require('../utils/validar');

async function obtener(id) {
  const userId = validarId(id);

  // Verificar que el usuario exista
  const usuario = await usuariosRepository.buscarPorId(userId);

  if (!usuario) {
    throw new HttpError(404, 'Usuario no encontrado');
  }

  // Consultar la informacion de progreso
  const progreso = await repository.obtenerProgreso(userId);
  const categorias = await repository.obtenerCategorias(userId);
  const marcas = await repository.obtenerMarcas(userId);

  return {
    user_id: userId,
    completed_classes: progreso?.completed_classes ?? 0,
    attendance_streak: progreso?.attendance_streak ?? 0,
    classes_by_category: categorias,
    personal_records: marcas
  };
}

module.exports = { obtener };
