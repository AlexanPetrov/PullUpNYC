import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "pullupny_user",
  password: process.env.DB_PASSWORD || "my_password",
  database: process.env.DB_NAME || "pullupnydb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function query(sql, params) {
  try {
    const [results] = await pool.query(sql, params);
    return results;
  } catch (error) {
    console.error("Database query error:", error);
    throw new Error("A database error occurred. Please try again later.");
  }
}
