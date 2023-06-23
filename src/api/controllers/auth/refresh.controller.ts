import { randomUUID } from 'crypto';
import { type Request, type Response } from 'express';
import { genAccessToken, genRefreshToken } from '../../utils/token';
import db from '../../../db/db';
import * as Crypto from '../../utils/crypto';

interface CustomRequest extends Request {
    user?: any;
}

export const refresh = async (
    req: CustomRequest,
    res: Response
): Promise<void> => {
    try {
        const user = req.user;
        const newTokenId = randomUUID();
        const newRefreshToken = await genRefreshToken(user, newTokenId);

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 * 30,
        });

        await db.query('DELETE FROM refresh_tokens WHERE id = $1', [
            user.jwtId,
        ]);

        const hashedToken = await Crypto.hash(newRefreshToken);
        await db.query(
            'INSERT INTO refresh_tokens (id, hashed_token, user_id) VALUES ($1, $2, $3)',
            [newTokenId, hashedToken, user.id]
        );

        const accessToken = await genAccessToken(user);

        res.json({ token: accessToken });
    } catch (error) {
        console.error('ERROR', error);
        res.status(500).json({ error: 'Internal Error' });
    }
};
