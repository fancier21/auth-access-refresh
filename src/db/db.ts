import dotenv from 'dotenv';
import { Pool, type QueryResult } from 'pg';

dotenv.config();

const pool = new Pool({
    // host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT ?? '5432', 10),
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
});

export const query = async (
    text: string,
    params?: any[]
): Promise<QueryResult> => {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('executed query', { text, duration, rows: res?.rowCount });
    return res;
};

export default pool;
