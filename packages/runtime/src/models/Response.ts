
export default class Response
{
    #result: unknown;
    #headers: Map<string, string>;

    constructor(result: unknown = undefined, headers = new Map())
    {
        this.#result = result;
        this.#headers = headers;
    }

    get result() { return this.#result; }

    set result(value: unknown) { this.#result = value; }

    get headers() { return this.#headers; }

    clearHeaders(): void
    {
        this.#headers.clear();
    }
    
    setHeader(name: string, value: string): void
    {
        this.#headers.set(name, value);
    }

    getHeader(name: string): string | undefined
    {
        return this.#headers.get(name);
    }

    removeHeader(name: string): void
    {
        this.#headers.delete(name);
    }
}
