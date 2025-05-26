import mysql from "mysql2/promise";
export default async function executeQuery({
  query,
  values,
}: {
  query: string;
  values?: any;
}) {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.HOST,
      password: process.env.PASSWORD,
      user: process.env.DB_USERNAME,
      database: process.env.DATABASE,
    });
    const [results]: any = await connection.query(query, values);
    return results;
  } catch (error) {
    console.log("error from excuteQuery:", error);
    throw error;
  } finally {
    if (connection) await connection.end();
  }
}
