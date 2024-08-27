
import { ArgumentManager } from './arguments';
import { CommandManager } from './commands';

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
        const command = this.#argumentManager.getCommand();
        const args = this.#argumentManager.getArguments();

        return this.#commandManager.execute(command, args);
    }
}
