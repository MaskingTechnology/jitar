
import InvalidVersionNumber from '../errors/InvalidVersionNumber.js';
import Version from '../models/Version.js';

export default class VersionParser
{
    static parse(number: string): Version
    {
        if (number.trim().length === 0)
        {
            return Version.DEFAULT;
        }
        
        const parts = number.split('.');

        switch (parts.length)
        {
            case 1: return new Version(Number.parseInt(parts[0]));
            case 2: return new Version(Number.parseInt(parts[0]), Number.parseInt(parts[1]));
            case 3: return new Version(Number.parseInt(parts[0]), Number.parseInt(parts[1]), Number.parseInt(parts[2]));
            default: throw new InvalidVersionNumber(number);
        }
    }
}
