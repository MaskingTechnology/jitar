
import ArgumentManager from './ArgumentManager';
import CommandManager from './CommandManager';

export default class CliManager
{
    #argumentManager: ArgumentManager;
    #commandManager: CommandManager;

    constructor()
    {
        this.#argumentManager = new ArgumentManager(process.argv);
        this.#commandManager = new CommandManager();
    }

    manage(): Promise<void>
    {
        const command = this.#argumentManager.getCommand() ?? 'help';

        return this.#commandManager.execute(command, this.#argumentManager);
    }
}
