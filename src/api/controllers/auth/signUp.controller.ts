import { type Request, type Response } from 'express';

export const signUp = (req: Request, res: Response): void => {
    const { email, username, password } = req.body;

    /**
     * @todo validate fields
     * @todo hash the password before storing database
     */

    const user = {
        email,
        username,
    };
    res.json(user);
};
