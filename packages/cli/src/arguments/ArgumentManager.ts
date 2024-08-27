
const COMMAND_INDEX = 2;

export default class ArgumentManager
{
    #args: string[];

    constructor(args: string[])
    {
        this.#args = args;
    }

    getCommand(): string
    {
        return this.#args[COMMAND_INDEX];
    }

    getArguments(): Map<string, string>
    {
        const args = this.#args.slice(COMMAND_INDEX + 1);

        const map = new Map<string, string>();

        args.forEach((arg) =>
        {
            const [key, value] = arg.split('=');

            map.set(key.trim(), value.trim());
        });

        return map;
    }
}
