
import type Writer from './Writer';

export default class Logger
{
    #debugEnabled: boolean;
    #writer: Writer;

    constructor(writer: Writer = console, debugEnabled: boolean = false)
    {
        this.#debugEnabled = debugEnabled;
        this.#writer = writer;
    }

    info(...message: unknown[]): void
    {
        const messageString = this.#createMessage('[INFO]', ...message);

        this.#writer.info(messageString);
    }

    warn(...message: unknown[]): void
    {
        const messageString = this.#createMessage('[WARN]', ...message);

        this.#writer.warn(messageString);
    }

    error(...message: unknown[]): void
    {
        const messageString = this.#createMessage('[ERROR]', ...message);

        this.#writer.error(messageString);
    }

    fatal(...message: unknown[]): void
    {
        const messageString = this.#createMessage('[FATAL]', ...message);

        this.#writer.error(messageString);
    }

    debug(...message: unknown[]): void
    {
        if (this.#debugEnabled === false)
        {
            return;
        }

        const messageString = this.#createMessage('[DEBUG]', ...message);

        this.#writer.debug(messageString);
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

        const prefix = this.#indent(level);

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

            const postfix = this.#indent(level - 1);

            return `[\n${items}\n${postfix}]`;
        }

        if (object instanceof Error)
        {
            return object.stack ?? object.message;
        }

        return JSON.stringify(object);
    }

    #indent(level: number): string
    {
        return '  '.repeat(level);
    }
}
