
import Command from './interfaces/Command';

import BuildCache from './implementations/BuildCache';
import StartServer from './implementations/StartServer';

export default class CommandManager
{
    #commands: Map<string, Command> = new Map<string, Command>();

    constructor()
    {
        // TODO: add commands 'help', 'version', 'init' and 'about'
        this.#commands.set('build', new BuildCache());
        this.#commands.set('start', new StartServer());
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
