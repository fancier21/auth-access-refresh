import { type Request, type Response } from 'express';
import { Crypto } from '../../utils/crypto';
import * as db from '../../../db/db';

export const signUp = async (req: Request, res: Response): Promise<any> => {
    /**
     * @todo validate fields
     * @todo check if user exists in db
     * @todo hash the password before storing database
     */
    try {
        const { email, username, password } = req.body;

        const hashedPassword = await Crypto.hash(password);
        const existingUser = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        if (existingUser.rows.length > 0) {
            throw new Error('Email already exists');
        }
        const newUser = await db.query(
            'INSERT INTO users (email, username, password) VALUES ($1, $2, $3)',
            [email, username, hashedPassword]
        );
        console.log('NEW', newUser);

        const user = {
            email,
            username,
        };
        res.json(user);
    } catch (error) {
        console.log('ERROR', error);
        return res.status(500).json({ error: 'Internal Error' });
    }
};
