
export default class Context
{
    #headers: Map<string, string> = new Map();

    constructor(headers: Map<string, string>)
    {
        this.#headers = headers;
    }

    get headers() { return this.#headers; }
}
