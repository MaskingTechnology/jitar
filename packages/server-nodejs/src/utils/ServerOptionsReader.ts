
import yargs from 'yargs';

import ServerOptions, { schema as serverOptionsSchema } from '../configuration/ServerOptions.js';

import DataConverter from './DataConverter.js';

export default class ServerOptionsReader
{
    static read(): ServerOptions
    {
        const args: object = yargs(process.argv).argv;
        const options = DataConverter.convert<ServerOptions>(serverOptionsSchema, args);

        return options;
    }
}
