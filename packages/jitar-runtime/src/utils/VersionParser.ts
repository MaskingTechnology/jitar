
import Version from '../models/Version.js';

export default class VersionParser
{
    static parse(number: string): Version
    {
        const parts = number.split('.');

        switch (parts.length)
        {
            case 1: return new Version(Number.parseInt(parts[0]));
            case 2: return new Version(Number.parseInt(parts[0]), Number.parseInt(parts[1]));
            case 3: return new Version(Number.parseInt(parts[0]), Number.parseInt(parts[1]), Number.parseInt(parts[2]));
            default: return new Version(0, 0, 0);
        }
    }
}
