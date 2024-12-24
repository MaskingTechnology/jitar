
export default class InvalidPath extends Error
{
    #path: string;

    constructor(path: string)
    {
        super(`Invalid path: ${path}`);

        this.#path = path;
    }

    get path() { return this.#path; }
}
