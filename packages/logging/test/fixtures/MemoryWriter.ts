
import type { Writer } from '../../src';

export default class MemoryWriter implements Writer
{
    #messages: string[] = [];

    get messages(): string[]
    {
        return this.#messages;
    }

    get lastMessage(): string | undefined
    {
        return this.#messages[this.#messages.length - 1];
    }

    log(message: string): void
    {
        this.#messages.push(message);
    }

    debug(message: string): void
    {
        this.#messages.push(message);
    }

    info(message: string): void
    {
        this.#messages.push(message);
    }

    warn(message: string): void
    {
        this.#messages.push(message);
    }

    error(message: string): void
    {
        this.#messages.push(message);
    }

    fatal(message: string): void
    {
        this.#messages.push(message);
    }

    clear(): void
    {
        this.#messages = [];
    }
}
