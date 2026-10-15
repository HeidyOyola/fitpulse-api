
const pool = require('../config/db');

// Consultar el progreso general del usuario
async function obtenerProgreso(userId) {
  const [filas] = await pool.query(
    `SELECT user_id, completed_classes, attendance_streak
     FROM progress
     WHERE user_id = ?`,
    [userId]
  );

  return filas[0];
}

// Consultar las clases completadas por categoria
async function obtenerCategorias(userId) {
  const [filas] = await pool.query(
    `SELECT category, total_classes
     FROM completed_classes_by_category
     WHERE user_id = ?`,
    [userId]
  );

  return filas;
}

// Consultar las marcas personales
async function obtenerMarcas(userId) {
  const [filas] = await pool.query(
    `SELECT record_id, activity, record_value, unit, record_date
     FROM personal_records
     WHERE user_id = ?
     ORDER BY record_date DESC, record_id DESC`,
    [userId]
  );

  return filas;
}

module.exports = {
  obtenerProgreso,
  obtenerCategorias,
  obtenerMarcas
};
