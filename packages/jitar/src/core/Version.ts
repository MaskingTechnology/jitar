
import InvalidVersionNumber from './errors/InvalidVersionNumber.js';

export default class Version
{
    static get DEFAULT(): Version { return new Version(0, 0, 0); }

    #major: number;
    #minor: number;
    #patch: number;

    constructor(major = 0, minor = 0, patch = 0)
    {
        this.#major = major;
        this.#minor = minor;
        this.#patch = patch;
    }

    get major() { return this.#major; }

    get minor() { return this.#minor; }

    get patch() { return this.#patch; }

    equals(version: Version): boolean
    {
        return this.#major === version.major
            && this.#minor === version.minor
            && this.#patch === version.patch;
    }

    greater(version: Version): boolean
    {
        if (this.#major !== version.major) return this.#major > version.major;
        if (this.#minor !== version.minor) return this.#minor > version.minor;
        if (this.#patch !== version.patch) return this.#patch > version.patch;

        return false;
    }

    less(version: Version): boolean
    {
        if (this.#major !== version.major) return this.#major < version.major;
        if (this.#minor !== version.minor) return this.#minor < version.minor;
        if (this.#patch !== version.patch) return this.#patch < version.patch;

        return false;
    }

    toString(): string
    {
        return `${this.#major}.${this.#minor}.${this.#patch}`;
    }

    static parse(number: string): Version
    {
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
