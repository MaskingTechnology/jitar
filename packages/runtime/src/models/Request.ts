
import Version from './Version.js';

export default class Request
{
    #fqn: string;
    #version: Version;
    #args: Map<string, unknown>;
    #headers: Map<string, string> = new Map();

    constructor(fqn: string, version: Version, args: Map<string, unknown>, headers: Map<string, string>)
    {
        this.#fqn = fqn;
        this.#version = version;
        this.#args = args;
        this.#headers = headers;
    }

    get fqn() { return this.#fqn; }

    get version() { return this.#version; }

    get args() { return this.#args; }

    get headers() { return this.#headers; }

    setArgument(name: string, value: unknown): void
    {
        this.#args.set(name, value);
    }

    getArgument(name: string): unknown
    {
        return this.#args.get(name);
    }

    removeArgument(name: string): void
    {
        this.#args.delete(name);
    }

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

    removeHeader(name: string): void
    {
        this.#headers.delete(name.toLowerCase());
    }
}
