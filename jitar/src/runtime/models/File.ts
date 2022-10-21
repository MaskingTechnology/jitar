
export default class File
{
    #location: string;
    #type: string;
    #content: Buffer | string;

    constructor(location: string, type: string, content: Buffer | string)
    {
        this.#location = location;
        this.#type = type;
        this.#content = content;
    }

    get location() { return this.#location; }

    get type() { return this.#type; }

    get content() { return this.#content; }

    get size() { return this.#content.length; }
}
