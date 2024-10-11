
export default class Response
{
    readonly #status: number;
    #result: unknown;
    readonly #headers: Map<string, string>;

    constructor(status: number, result: unknown = undefined, headers = new Map())
    {
        this.#status = status;
        this.#result = result;
        this.#headers = headers;
    }

    get status() { return this.#status; }

    get result() { return this.#result; }

    set result(value: unknown) { this.#result = value; }

    get headers() { return this.#headers; }

    clearHeaders(): void
    {
        this.#headers.clear();
    }
    
    setHeader(name: string, value: string): void
    {
        this.#headers.set(name.toLowerCase(), value);
    }

    getHeader(name: string): string | undefined
    {
        return this.#headers.get(name.toLowerCase());
    }

    hasHeader(name: string): boolean
    {
        return this.#headers.has(name.toLowerCase());
    }

    removeHeader(name: string): void
    {
        this.#headers.delete(name.toLowerCase());
    }
}
