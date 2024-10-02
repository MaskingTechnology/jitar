
export default class FileNotFound extends Error
{
    #filename: string;

    constructor(filename: string)
    {
        super(`The file '${filename}' could not be found`);

        this.#filename = filename;
    }

    get filename() { return this.#filename; }
}
