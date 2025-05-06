
export default class InvalidPath extends Error
{
    readonly #location: string;

    constructor(location: string)
    {
        super(`Invalid location: ${location}`);

        this.#location = location;
    }

    get location() { return this.#location; }
}
