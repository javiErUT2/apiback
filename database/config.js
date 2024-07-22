import { createPool } from "mysql2/promise";
import 'dotenv/config';

export const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
})

export const getConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Database connected');
        connection.release(); // Release the connection back to the pool
    }catch (error) {
        console.log(error);
        throw new Error('Database connection failed');
    }
}
