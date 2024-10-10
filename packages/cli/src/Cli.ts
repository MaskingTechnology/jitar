
import ArgumentProcessor from './ArgumentProcessor';
import CommandRunner from './CommandRunner';

export default class Cli
{
    readonly #argumentProcessor: ArgumentProcessor;
    readonly #commandRunner: CommandRunner;

    constructor()
    {
        this.#argumentProcessor = new ArgumentProcessor(process.argv);
        this.#commandRunner = new CommandRunner();
    }

    start(): Promise<void>
    {
        const commandName = this.#argumentProcessor.getCommand() ?? 'help';

        return this.#commandRunner.run(commandName, this.#argumentProcessor);
    }
}
