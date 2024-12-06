
import crypto from 'crypto';

export default class IdGenerator
{
    generate(): string
    {
        return crypto.randomUUID();
    }
}
