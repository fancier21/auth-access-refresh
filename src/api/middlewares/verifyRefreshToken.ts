import { type Response, type Request, type NextFunction } from 'express';
import db from '../../db/db';
import * as Crypto from '../utils/crypto';
import { verifyToken } from '../utils/verifyToken';

export const verifyRefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.cookies.refreshToken;

        if (typeof token !== 'string' || token.trim() === '') {
            res.status(400).json({ error: 'Missing or invalid refresh token' });
            return;
        }

        let user;
        try {
            user = await verifyToken(token, process.env.REFRESH_TOKEN);
        } catch (error) {
            res.status(400).json({ error: 'Invalid refresh token' });
            return;
        }

        const queryResult = await db.query(
            'SELECT hashed_token FROM refresh_tokens WHERE id = $1',
            [user.jwtId]
        );

        if (queryResult.rowCount === 0) {
            res.status(400).json({ error: 'Invalid refresh token' });
            return;
        }

        const hashedToken = queryResult.rows[0].hashed_token;

        const match = await Crypto.verify(hashedToken, token);
        console.dir({ match });
        if (!match) {
            res.status(400).json({ error: 'Invalid refresh token' });
            return;
        }

        req.user = user;

        next();
    } catch (error) {
        console.error('ERROR', error);
        res.status(500).json({ error: 'Internal Error' });
    }
};
