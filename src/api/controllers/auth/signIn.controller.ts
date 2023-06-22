import { type Request, type Response } from 'express';
import { randomUUID } from 'crypto';
import * as db from '../../../db/db';
import { Crypto } from '../../utils/crypto';
import { genAccessToken, genRefreshToken } from '../../utils/token';

export const signIn = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;

        const user = await db.query('SELECT * FROM users WHERE username = $1', [
            username,
        ]);

        if (user.rowCount === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const userData = user.rows[0];
        const match = await Crypto.verify(userData?.password, password);

        if (!match) {
            res.status(401).json({ error: 'Invalid password' });
            return;
        }

        const accessToken = await genAccessToken(userData);
        const tokenId = randomUUID();
        const refreshToken = await genRefreshToken(userData, tokenId);

        try {
            await db.query(
                'INSERT INTO refresh_tokens (hashed_token, user_id) VALUES ($1, $2)',
                [refreshToken, userData.id]
            );
        } catch (error) {
            console.error('ERROR', error);
            res.status(500).json({ error: 'Failed to insert refresh token' });
            return;
        }

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
        });

        res.json({ token: accessToken });
    } catch (error) {
        console.error('ERROR', error);
        res.status(500).json({ error: 'Internal Error' });
    }
};
