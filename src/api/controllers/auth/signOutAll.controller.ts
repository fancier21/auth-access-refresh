import { type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import db from '../../../db/db';

export const signOutAll = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (typeof refreshToken !== 'string' || refreshToken.trim() === '') {
            res.status(400).json({ error: 'Missing or invalid refresh token' });
            return;
        }

        let user;
        try {
            user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN) as any;
        } catch (error) {
            res.status(400).json({ error: 'Invalid refresh token' });
            return;
        }

        await db.query('DELETE FROM refresh_tokens WHERE user_id = $1', [
            user.id,
        ]);
        res.clearCookie('refresh_token');

        res.status(200);
    } catch (error) {
        console.error('ERROR', error);
        res.status(500).json({ error: 'Internal Error' });
    }
};
