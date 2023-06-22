import { type Request, type Response } from 'express';
import { Crypto } from '../../utils/crypto';
import * as db from '../../../db/db';

interface FieldErrors {
    email?: string;
    username?: string;
}

export const signUp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, username, password } = req.body;

        const existingUser = await db.query(
            'SELECT * FROM users WHERE email = $1 OR username = $2',
            [email, username]
        );

        if (existingUser.rowCount > 0) {
            const fieldErrors: FieldErrors = {};

            for (const user of existingUser.rows) {
                if (user.email === email) {
                    fieldErrors.email = 'Email already exists';
                }
                if (user.username === username) {
                    fieldErrors.username = 'Username already exists';
                }
            }

            res.status(409).json({ errors: fieldErrors });
            return;
        }

        const hashedPassword = await Crypto.hash(password);

        const newUser = await db.query(
            'INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING email, username',
            [email, username, hashedPassword]
        );

        if (newUser.rowCount !== 1) {
            res.status(400).json({ error: 'Failed to create user' });
            return;
        }

        const { email: userEmail, username: userUsername } = newUser.rows[0];
        const userData = {
            email: userEmail,
            username: userUsername,
        };

        res.json(userData);
    } catch (error) {
        console.error('ERROR', error);

        res.status(500).json({ error: 'Internal Error' });
    }
};
