
import Command from './Command';

import ShowHelp from './commands/ShowHelp';
import ShowAbout from './commands/ShowAbout';
import ShowVersion from './commands/ShowVersion';
import BuildApp from './commands/BuildApp';
import StartServer from './commands/StartServer';

import ArgumentManager from './ArgumentProcessor';

export default class CommandRunner
{
    #commands: Map<string, Command> = new Map<string, Command>();

    constructor()
    {
        // TODO: add 'init' command
        this.#commands.set('help', new ShowHelp());
        this.#commands.set('about', new ShowAbout());
        this.#commands.set('version', new ShowVersion());
        this.#commands.set('build', new BuildApp());
        this.#commands.set('start', new StartServer());
    }

    run(name: string, args: ArgumentManager): Promise<void>
    {
        const command = this.#commands.get(name);

        if (command === undefined)
        {
            throw new Error(`Command ${name} not found`);
        }

        return command.execute(args);
    }
}
