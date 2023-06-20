import { type Request, type Response } from 'express';

export const signIn = (req: Request, res: Response): void => {
    const { username, password } = req.body;

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

    res.json({});
};
