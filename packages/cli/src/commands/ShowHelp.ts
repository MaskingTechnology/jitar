
import ArgumentProcessor from '../ArgumentProcessor';
import Command from '../Command';

const LABEL_PADDING = 3;

export default class ShowHelp implements Command
{
    readonly name = 'help';
    readonly description = 'Shows all available commands (this message).';
    readonly options =
    [
        { key: '[command]', required: false, description: 'The command name to show more details for' }
    ];

    readonly #commands: Set<Command>;

    constructor(commands: Set<Command>)
    {
        this.#commands = commands;
    }

    async execute(args: ArgumentProcessor): Promise<void>
    {
        for (const command of this.#commands.values())
        {
            if (args.containsKey(command.name))
            {
                return this.#showCommandDetails(command);
            }
        }

        this.#listCommands();
    }

    #listCommands(): void
    {
        console.log('\njitar <command>\n');
        console.log('Available commands:');

        const commands = [...this.#commands.values()];
        const commandNames = commands.map(command => command.name);
        const paddingSize = this.#determinePaddingSize(commandNames);
        
        for (const command of commands)
        {
            const name = command.name.padEnd(paddingSize, ' ');
            const description = command.description;

            console.log(`  ${name} ${description}`);
        }

        console.log('\nFor the options per command, use:');
        console.log('  jitar help [command]\n');
    }

    #showCommandDetails(command: Command): void
    {
        console.log(`\n${command.description}\n`);
        
        const options = command.options;

        if (options.length === 0)
        {
            console.log('No options available.\n');

            return;
        }

        console.log('Options:');

        const optionKeys = options.map(option => option.key);
        const paddingSize = this.#determinePaddingSize(optionKeys);
        
        for (const option of options)
        {
            const key = option.key.padEnd(paddingSize, ' ');
            const description = option.description;
            const defaultValue = option.defaultValue ? `default: ${option.defaultValue}` : 'no default value';
            const required = option.required ? 'required' : `optional - ${defaultValue}`;

            console.log(`  ${key} ${description} (${required})`);
        }

        console.log();
    }

    #determinePaddingSize(labels: string[]): number
    {
        const maxLength = labels.reduce((maxSize, label) => label.length > maxSize ? label.length : maxSize, 0);

        return maxLength + LABEL_PADDING;
    }
}
