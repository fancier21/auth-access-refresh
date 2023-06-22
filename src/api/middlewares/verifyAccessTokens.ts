import { type Response, type Request, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
    user?: any;
}

export const verifyAccessToken = (
    req: CustomRequest,
    res: Response,
    next: NextFunction
): void => {
    try {
        const authHeader = req.headers.authorization;

        if (typeof authHeader === 'string' && authHeader.trim() !== '') {
            const token = authHeader.split(' ')[1]; // Extract the token from the header

            try {
                const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
                req.user = decoded;

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
