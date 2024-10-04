
import ArgumentProcessor from '../ArgumentProcessor';
import Command from '../Command';

const message = `
Usage: jitar <command> [options]

Commands:
  build     Builds the application (creates segment bundles)
  start     Starts a server with the configured service
  about     Shows information about Jitar
  version   Shows the installed version of Jitar
  help      Shows help (this message)

Options:
  --config            Path to the configuration file (default: jitar.json)
  --service           Path to the service configuration file (required for 'start' command)
  --env-file          Path to the environment file (default: none)
  --log-level         Optional for 'start' and 'build' commands (default: info, other options: debug, warn, error, fatal)
  --http-body-limit   Optional for 'start' command (default: 204,800 bytes)
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
