
import Command from './interfaces/Command';

import ShowHelp from './commands/ShowHelp';
import ShowAbout from './commands/ShowAbout';
import ShowVersion from './commands/ShowVersion';
import BuildCache from './commands/BuildCache';
import StartServer from './commands/StartServer';

import ArgumentManager from './ArgumentManager';

export default class CommandManager
{
    #commands: Map<string, Command> = new Map<string, Command>();

    constructor()
    {
        // TODO: add 'init' command
        this.#commands.set('help', new ShowHelp());
        this.#commands.set('about', new ShowAbout());
        this.#commands.set('version', new ShowVersion());
        this.#commands.set('build', new BuildCache());
        this.#commands.set('start', new StartServer());
    }

    execute(name: string, args: ArgumentManager): Promise<void>
    {
        const command = this.#commands.get(name);

        if (command === undefined)
        {
            throw new Error(`Command ${name} not found`);
        }

        return command.execute(args);
    }
}
