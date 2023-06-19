import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export class Crypto {
    static async hash(data: string): Promise<any> {
        const salt = randomBytes(8).toString('hex');
        const buf = (await scryptAsync(data, salt, 64)) as Buffer;

        return `${buf.toString('hex')}.${salt}`;
    }

    static async verify(
        storedData: string,
        suppliedData: string
    ): Promise<boolean> {
        const [hashedData, salt] = storedData.split('.');
        const buf = (await scryptAsync(suppliedData, salt, 64)) as Buffer;

        return buf.toString('hex') === hashedData;
    }
}
