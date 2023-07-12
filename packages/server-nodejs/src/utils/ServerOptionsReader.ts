
import yargs from 'yargs';

import ServerOptions, { serverOptionsSchema } from '../configuration/ServerOptions.js';

import DataConverter from './DataConverter.js';

export default class ServerOptionsReader
{
    static read(): ServerOptions
    {
        const args: object = yargs(process.argv).argv;
        return DataConverter.convert<ServerOptions>(serverOptionsSchema, args);
    }
}
