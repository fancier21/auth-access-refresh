import { type Response, type Request, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyAccessToken = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const authHeader = req.headers.authorization;

        if (typeof authHeader === 'string' && authHeader.trim() !== '') {
            const token = authHeader.split(' ')[1]; // Extract the token from the header

            try {
                const user = jwt.verify(token, process.env.ACCESS_TOKEN);
                req.user = user;

                next();
            } catch (error) {
                res.status(401).json({ error: 'Invalid access token' });
            }
        } else {
            res.status(401).json({ error: 'Missing or empty access token' });
        }
    } catch (error) {
        console.error('ERROR', error);
        res.status(500).json({ error: 'Internal Error' });
    }
};
