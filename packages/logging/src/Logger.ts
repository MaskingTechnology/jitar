
export default class Logger
{
    #debugEnabled: boolean;

    constructor(debugEnabled: boolean = false)
    {
        this.#debugEnabled = debugEnabled;
    }

    info(...message: unknown[]): void
    {
        const messageString = this.#createMessage('[INFO]', ...message);

        console.info(messageString);
    }

    warn(...message: unknown[]): void
    {
        const messageString = this.#createMessage('[WARN]', ...message);

        console.warn(messageString);
    }

    error(...message: unknown[]): void
    {
        const messageString = this.#createMessage('[ERROR]', ...message);

        console.error(messageString);
    }

    debug(...message: unknown[]): void
    {
        if (this.#debugEnabled === false)
        {
            return;
        }

        const messageString = this.#createMessage('[DEBUG]', ...message);

        console.debug(messageString);
    }

    #createMessage(...message: unknown[]): string
    {
        return message.map(value => this.#interpretValue(value)).join(' ');
    }

    #interpretValue(value: unknown): string
    {
        switch (typeof value)
        {
            case 'string': return value;
            case 'object': return this.#interpretObject(value);
            case 'undefined': return 'undefined';
            case 'function': return 'function';
            default: return String(value);
        }
    }

    #interpretObject(object: unknown): string
    {
        if (object === null)
        {
            return 'null';
        }

        if (Array.isArray(object))
        {
            return object.map(value => this.#interpretValue(value)).join(' ');
        }

        if (object instanceof Error)
        {
            return object.stack ?? object.message;
        }

        return JSON.stringify(object);
    }
}
