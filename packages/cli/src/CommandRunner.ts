
import Command from './Command';

import ShowHelp from './commands/ShowHelp';
import ShowAbout from './commands/ShowAbout';
import ShowVersion from './commands/ShowVersion';
import InitApp from './commands/InitApp';
import BuildApp from './commands/BuildApp';
import StartServer from './commands/StartServer';

import ArgumentManager from './ArgumentProcessor';

export default class CommandRunner
{
    readonly #commands = new Set<Command>();

    constructor()
    {
        this.#commands.add(new ShowHelp(this.#commands));
        this.#commands.add(new ShowAbout());
        this.#commands.add(new ShowVersion());
        this.#commands.add(new InitApp());
        this.#commands.add(new BuildApp());
        this.#commands.add(new StartServer());
    }

    run(name: string, args: ArgumentManager): Promise<void>
    {
        const command = [...this.#commands.values()].find(command => command.name === name);

        if (command === undefined)
        {
            throw new Error(`Command ${name} not found`);
        }

        return command.execute(args);
    }
}
