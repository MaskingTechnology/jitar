
import MissingArgument from './errors/MissingArgument';

const COMMAND_INDEX = 2;

export default class ArgumentProcessor
{
    readonly #command: string | undefined;
    readonly #args: Map<string, string>;

    constructor(args: string[])
    {
        this.#command = args[COMMAND_INDEX];
        this.#args = this.#parseArguments(args);
    }

    getCommand(): string | undefined
    {
        return this.#command;
    }

    containsKey(key: string): boolean
    {
        return this.#args.has(key);
    }

    getRequiredArgument(name: string): string
    {
        const value = this.#args.get(name);

        if (value === undefined)
        {
            throw new MissingArgument(name);
        }

        return value;
    }

    getOptionalArgument<T>(name: string, defaultValue: T): T
    {
        return this.#args.get(name) as T ?? defaultValue;
    }

    #parseArguments(args: string[]): Map<string, string>
    {
        const commandArgs = args.slice(COMMAND_INDEX + 1);

        const map = new Map<string, string>();

        commandArgs.forEach((arg) =>
        {
            const [key, value] = arg.split('=');

            map.set(key.trim(), value?.trim());
        });

        return map;
    }
}
