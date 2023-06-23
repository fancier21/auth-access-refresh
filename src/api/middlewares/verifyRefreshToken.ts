import { type Response, type Request, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import db from '../../db/db';
import { Crypto } from '../utils/crypto';

interface CustomRequest extends Request {
    user?: any;
}

export const verifyRefreshToken = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.cookies.refreshToken;

        if (typeof token !== 'string' || token.trim() === '') {
            res.status(400).json({ error: 'Missing or invalid refresh token' });
            return;
        }

        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN) as any;
        console.log('DECODED', decoded);

        const queryResult = await db.query(
            'SELECT hashed_token FROM refresh_tokens WHERE id = $1',
            [decoded.jwtId]
        );

        if (queryResult.rowCount === 0) {
            res.status(400).json({ error: 'Refresh token does not exist' });
            return;
        }

        const hashedToken = queryResult.rows[0].hashed_token;

        const match = await Crypto.verify(hashedToken, token);
        console.dir({ match });
        if (!match) {
            res.status(400).json({ error: 'Invalid refresh token' });
            return;
        }

        req.user = decoded;

        next();
    } catch (error) {
        console.error('ERROR', error);
        res.status(500).json({ error: 'Internal Error' });
    }
};
