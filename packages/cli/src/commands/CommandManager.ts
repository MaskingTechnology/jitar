
import Command from './interfaces/Command';

import BuildCache from './implementations/BuildCache';

export default class CommandManager
{
    #commands: Map<string, Command> = new Map<string, Command>();

    constructor()
    {
        this.#commands.set('build', new BuildCache());
    }

    execute(name: string, args: Map<string, string>): Promise<void>
    {
        const command = this.#commands.get(name);

        if (command === undefined)
        {
            throw new Error(`Command ${name} not found`);
        }

        return command.execute(args);
    }
}
