
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

    #interpretValue(value: unknown, level: number = 0): string
    {
        let result: string;

        switch (typeof value)
        {
            case 'string': result = value; break;
            case 'object': result = this.#interpretObject(value, level + 1); break;
            case 'undefined': result = 'undefined'; break;
            case 'function': result = 'function'; break;
            default: result = String(value); break;
        }

        const prefix = '  '.repeat(level);

        return `${prefix}${result}`;
    }

    #interpretObject(object: unknown, level: number): string
    {
        if (object === null)
        {
            return 'null';
        }

        if (Array.isArray(object))
        {
            const items = object.map(value => this.#interpretValue(value, level)).join(',\n');

            return `[\n${items}\n]`;
        }

        if (object instanceof Error)
        {
            return object.stack ?? object.message;
        }

        return JSON.stringify(object);
    }
}
