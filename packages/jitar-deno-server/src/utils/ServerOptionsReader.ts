
import yargs from 'npm:yargs@^17.6.0';

import ServerOptions from '../configuration/ServerOptions.ts';

import DataConverter from './DataConverter.ts';

export default class ServerOptionsReader
{
    static async read(): Promise<ServerOptions>
    {
        const args: object = yargs(Deno.args).argv
        const options = await DataConverter.convert<ServerOptions>(ServerOptions, args);

        return options;
    }
}
