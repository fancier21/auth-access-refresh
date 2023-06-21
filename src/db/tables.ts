import db from './db';

export async function createTables(): Promise<any> {
    try {
        const addUUID = 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"';

        // Table creation queries
        const createTableUser = `
          CREATE TABLE IF NOT EXISTS users (
            id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            email      VARCHAR(255) UNIQUE,
            username   VARCHAR(255) UNIQUE,
            password   VARCHAR(255),
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
          )
        `;

        const createTableRefreshToken = `
          CREATE TABLE IF NOT EXISTS refresh_tokens (
            id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            hashed_token TEXT,
            user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
            created_at   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
          )
        `;

        // Execute table creation queries
        await db.query(addUUID);
        await db.query(createTableUser);
        await db.query(createTableRefreshToken);

        console.log('Tables created successfully.');
    } catch (error) {
        console.error('Error creating tables:', error);
    }
}
