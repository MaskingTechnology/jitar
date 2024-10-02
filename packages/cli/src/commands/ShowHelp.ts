
import Command from '../Command';
import ArgumentProcessor from '../ArgumentProcessor';

const message = `
Usage: jitar <command> [options]

Commands:
  build     Builds the application (creates segment bundles)
  start     Starts a server with the configured service
  about     Shows information about Jitar
  version   Shows the installed version of Jitar
  help      Shows help (this message)

Options:
  --config    Path to the configuration file (default: jitar.json)
  --service   Path to the service configuration file (required for 'start' command)
  --env-file  Path to the environment file (default: none)

More information can be found at https://docs.jitar.dev
`;

export default class ShowHelp implements Command
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async execute(args: ArgumentProcessor): Promise<void>
    {
        console.log(message);
    }
}
