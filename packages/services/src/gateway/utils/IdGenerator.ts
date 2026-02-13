
import crypto from 'node:crypto';

export default class IdGenerator
{
    generate(): string
    {
        return crypto.randomUUID();
    }
}
