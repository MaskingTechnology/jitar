
import Command from '../interfaces/Command';
import ArgumentManager from '../ArgumentManager';

const message = `
Usage: jitar <command> [options]

Commands:
  build     Builds the application
  start     Starts a Jitar instance
  about     Show information about Jitar
  version   Show the version of Jitar
  help      Shows help (this message)

Options:
  --config    Path to the configuration file (default: jitar.json)
  --service   Path to the service configuration file (required for 'start' command)

More information can be found at https://docs.jitar.dev
`;

export default class ShowHelp implements Command
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async execute(args: ArgumentManager): Promise<void>
    {
        console.log(message);
    }
}
