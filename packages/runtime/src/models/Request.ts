
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

    clearHeaders()
    {
        this.#headers.clear();
    }

    setHeader(name: string, value: string)
    {
        this.#headers.set(name, value);
    }
}
