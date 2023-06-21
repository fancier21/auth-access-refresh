import { type Request, type Response } from 'express';
import { randomUUID } from 'crypto';
import * as db from '../../../db/db';
import { Crypto } from '../../utils/crypto';
import { genAccessToken, genRefreshToken } from '../../utils/token';

export const signIn = async (req: Request, res: Response): Promise<any> => {
    /**
     * @todo validate credentials
     * @todo check if user exists in db
     * @todo if not, throw error 404, User not found
     * @todo if exists, compare passwords
     * @todo if password wrong, throw error 401, Wrong password
     * @todo if the passwords match, generate access token
     * @todo generate tockenId by UUID
     * @todo generate refresh token by user and tokenId
     * @todo add refresh token to cookie
     * @todo hash refresh token and add to the db by tokenId, user.id, refresh token
     * @send access token to user
     */

    try {
        const { username, password } = req.body;
        const user = await db.query('SELECT * FROM users WHERE username = $1', [
            username,
        ]);
        if (user.rows.length === 0) {
            throw new Error('User not found');
        }

        const userData = user.rows[0];
        const match = await Crypto.verify(userData?.password, password);
        if (!match) {
            throw new Error('Invalid password');
        }

        const accessToken = await genAccessToken(userData);
        const tokenId = randomUUID();
        const refreshToken = await genRefreshToken(userData, tokenId);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 30 * 1000, // 30 days
        });

        await db.query(
            'INSERT INTO refresh_tokens (hashed_token, user_id) VALUES ($1, $2)',
            [refreshToken, userData.id]
        );

        res.json({ token: accessToken });
    } catch (error) {
        console.log('ERROR', error);
        return res.status(500).json({ error: 'Internal Error' });
    }
};
