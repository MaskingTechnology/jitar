
import InvalidVersionNumber from '../errors/InvalidVersionNumber.js';

import Version from '../models/Version.js';

const versionExpression = /^\d+(?:\.\d+){0,2}$/;

export default class VersionParser
{
    static parse(number: unknown): Version
    {
        if (typeof number !== 'string')
        {
            throw new InvalidVersionNumber(String(number));
        }

        if (number.trim().length === 0)
        {
            return Version.DEFAULT;
        }

        if (versionExpression.test(number) === false)
        {
            throw new InvalidVersionNumber(number);
        }

        const parts = number.split('.');

        switch (parts.length)
        {
            case 1: return new Version(Number.parseInt(parts[0]));
            case 2: return new Version(Number.parseInt(parts[0]), Number.parseInt(parts[1]));
            default: return new Version(Number.parseInt(parts[0]), Number.parseInt(parts[1]), Number.parseInt(parts[2]));
        }
    }
}
