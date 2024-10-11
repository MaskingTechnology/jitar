
import type { RunMode } from '../definitions/RunModes';

import type Version from './Version';

export default class Request
{
    readonly #fqn: string;
    readonly #version: Version;
    readonly #args: Map<string, unknown>;
    readonly #headers = new Map<string, string>();
    readonly #mode: RunMode;

    constructor(fqn: string, version: Version, args: Map<string, unknown>, headers: Map<string, string>, mode: RunMode)
    {
        this.#fqn = fqn;
        this.#version = version;
        this.#args = args;
        this.#headers = headers;
        this.#mode = mode;
    }

    get fqn() { return this.#fqn; }

    get version() { return this.#version; }

    get args() { return this.#args; }

    get headers() { return this.#headers; }

    get mode() { return this.#mode; }

    clearArguments(): void
    {
        this.#args.clear();
    }

    setArgument(name: string, value: unknown): void
    {
        this.#args.set(name, value);
    }

    getArgument(name: string): unknown
    {
        return this.#args.get(name);
    }

    hasArgument(name: string): boolean
    {
        return this.#args.has(name);
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

    hasHeader(name: string): boolean
    {
        return this.#headers.has(name.toLowerCase());
    }

    removeHeader(name: string): void
    {
        this.#headers.delete(name.toLowerCase());
    }
}
