import jwt from 'jsonwebtoken';

export const verifyToken = async (
    token: string,
    secretKey: string
): Promise<any> => {
    try {
        const user = jwt.verify(token, secretKey) as any;
        return user;
    } catch (error) {
        throw new Error();
    }
};
