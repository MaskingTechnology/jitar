
import crypto from 'crypto';

export default class IdGenerator
{
    generateUUID(): string
    {
        return crypto.randomUUID();
    }
}
