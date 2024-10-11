
export default class ModuleNotLoaded extends Error
{
    readonly #url: string;
    readonly #reason?: string;

    constructor(url: string, reason?: string)
    {
        const postfix = reason !== undefined ? ` | ${reason}` : '';

        super(`Module '${url}' could not be loaded${postfix}`);

        this.#url = url;
        this.#reason = reason;
    }

    get url() { return this.#url; }

    get reason() { return this.#reason; }
}
