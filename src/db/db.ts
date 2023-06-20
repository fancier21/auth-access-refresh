import dotenv from 'dotenv';
import { Pool, type PoolClient, type QueryResult } from 'pg';

dotenv.config();

const pool = new Pool({
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT ?? '5432', 10),
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
});

interface ExtendedPoolClient extends PoolClient {
    lastQuery?: any[];
}

export const query = async (
    text: string,
    params: any[]
): Promise<QueryResult> => {
    try {
        const start = Date.now();
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('executed query', { text, duration, rows: res?.rowCount });
        return res;
    } catch (error) {
        return await Promise.reject(error);
    }
};

export const getClient = async (): Promise<ExtendedPoolClient> => {
    const client = (await pool.connect()) as ExtendedPoolClient;
    const queryFn = client.query.bind(client);
    const releaseFn = client.release;

    const handleTimeout = (): void => {
        console.error('A client has been checked out for more than 5 seconds!');
        if (client.lastQuery !== undefined) {
            console.error(
                `The last executed query on this client was: ${
                    client.lastQuery as unknown as string
                }`
            );
        } else {
            console.error('No query was executed on this client.');
        }
    };

    const timeout: NodeJS.Timeout = setTimeout(handleTimeout, 5000);

    client.query = ((
        ...args: Parameters<typeof queryFn>
    ): ReturnType<typeof queryFn> => {
        client.lastQuery = args;
        queryFn(...args);
    }) as typeof client.query;

    client.release = (): void => {
        clearTimeout(timeout);
        client.query = queryFn;
        client.release = releaseFn;
        releaseFn.apply(client);
    };

    return client;
};

export default pool;
