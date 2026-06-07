// require("dotenv").config();
const pool = require("../db/pool");

async function upsertByPhone({ wa_phone, name, source, created_via_session_id }){
  const { rows } = await pool.query(
    `INSERT INTO leads (wa_phone, name, source, created_via_session_id)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (wa_phone)
    DO UPDATE SET name = EXCLUDED.name, source = EXCLUDED.source, updated_at = NOW()
    RETURNING *`,
    [wa_phone, name, source, created_via_session_id]
  );
  return rows[0];
}

async function list({ limit = 20, offset = 0, q, status }, user) {
  const params = [];
  const conditions = [];

  if (q) {
    params.push(`%${q}%`);
    conditions.push(`(name ILIKE $${params.length} OR email ILIKE $${params.length})`);
  }
  if (status) {
    params.push(status);
    conditions.push(`status = $${params.length}`);
  }
  if (user.role !== "admin") {
    params.push(user.id);
    conditions.push(`assigned_to = $${params.length}`);
}

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  params.push(limit, offset);

  const { rows } = await pool.query(
    `SELECT * FROM leads ${where} ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );
  return rows;
}

async function findById(id) {
  const { rows } = await pool.query("SELECT * FROM leads WHERE id = $1", [id]);
  return rows[0] || null;
}

async function updateStatus(id, status) {
  const { rows } = await pool.query(
    `UPDATE leads SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [status, id]
  );
  return rows[0] || null;
}

async function statsByStatus() {
  const { rows } = await pool.query(
    `SELECT status, COUNT(*)::int AS total FROM leads GROUP BY status`
  );
  return rows;
}

module.exports = { list, findById, updateStatus, statsByStatus, upsertByPhone };