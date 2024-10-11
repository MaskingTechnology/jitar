
import { LogLevel, LogLevels } from './definitions/LogLevel';
import type Writer from './Writer';

export default class Logger
{
    readonly #logLevel: LogLevel;
    readonly #writer: Writer;

    constructor(logLevel: LogLevel = LogLevels.INFO, writer: Writer = console)
    {
        this.#logLevel = logLevel;
        this.#writer = writer;
    }

    debug(...message: unknown[]): void
    {
        if (this.#logLevel > LogLevels.DEBUG)
        {
            return;
        }

        const messageString = this.#createMessage('DEBUG', message);

        this.#writer.debug(messageString);
    }

    info(...message: unknown[]): void
    {
        if (this.#logLevel > LogLevels.INFO)
        {
            return;
        }

        const messageString = this.#createMessage('INFO', message);

        this.#writer.info(messageString);
    }

    warn(...message: unknown[]): void
    {
        if (this.#logLevel > LogLevels.WARN)
        {
            return;
        }

        const messageString = this.#createMessage('WARN', message);

        this.#writer.warn(messageString);
    }

    error(...message: unknown[]): void
    {
        if (this.#logLevel > LogLevels.ERROR)
        {
            return;
        }

        const messageString = this.#createMessage('ERROR', message);

        this.#writer.error(messageString);
    }

    fatal(...message: unknown[]): void
    {
        const messageString = this.#createMessage('FATAL', message);

        this.#writer.error(messageString);
    }

    #createMessage(logLevel: string, messages: unknown[]): string
    {
        const moment = new Date().toISOString();
        const message = messages.map(value => this.#interpretValue(value)).join(' ');

        return `[${logLevel}][${moment}] ${message}`;
    }

    #interpretValue(value: unknown, level = 0): string
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
