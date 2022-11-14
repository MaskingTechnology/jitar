
import yargs from 'yargs';

import ServerOptions from '../configuration/ServerOptions.js';

import DataConverter from './DataConverter.js';

export default class ServerOptionsReader
{
    static async read(): Promise<ServerOptions>
    {
        const args: object = yargs(process.argv).argv
        const options = await DataConverter.convert<ServerOptions>(ServerOptions, args);

        return options;
    }
}
