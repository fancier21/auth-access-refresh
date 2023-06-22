import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';

interface User {
    id: string;
    username: string;
    email: string;
}

const genToken = async (
    user: User,
    secret: string,
    expiresIn: string,
    tokenId?: string
): Promise<string | any> => {
    try {
        console.dir({ user, secret, expiresIn, tokenId });
        const { id, username, email } = user;
        const jwtId = tokenId ?? randomUUID();
        const token = jwt.sign({ jwtId, id, username, email }, secret, {
            algorithm: 'HS256',
            expiresIn,
        });
        return token;
    } catch (error) {
        console.error('---- TOKEN GEN ERR', error);
    }
};

export const genAccessToken = async (user: User): Promise<string> => {
    return await genToken(user, process.env.ACCESS_TOKEN!, '5m');
};

export const genRefreshToken = async (
    user: User,
    tokenId: string
): Promise<string> => {
    return await genToken(user, process.env.REFRESH_TOKEN!, '30d', tokenId);
};
