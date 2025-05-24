import db from "./db"
import { pool } from "./db";

export const createUser = async (email, password) => {
  const result = await pool.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id', [email, password]);
  return result.rows[0].id;
}

export const getUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
}