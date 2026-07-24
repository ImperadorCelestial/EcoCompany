import "dotenv/config";
import mysql from "mysql2/promise";

const banco = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORTA || 3306),
  user: process.env.DB_USUARIO || "root",
  password: process.env.DB_SENHA || "",
  database: process.env.DB_NOME || "eco_company",
  waitForConnections: true,
  connectionLimit: 10,
  decimalNumbers: true,
  dateStrings: true,
  charset: "utf8mb4"
});

export async function verificarBanco() {
  await banco.query("SELECT 1");
}

export default banco;
