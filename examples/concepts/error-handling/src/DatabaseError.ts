
// This is a custom error class that extends the built-in Error class.
// For serialization purposes, it is required to save input parameters.

export default class DatabaseError extends Error
{
    #text: string;

    constructor(text: string)
    {
        super(`This is a database error: '${text}'`);

        this.#text = text;
    }

    get text() { return this.#text; };
}
