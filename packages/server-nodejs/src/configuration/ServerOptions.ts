
import { z } from 'zod';
import { LogLevel } from '../utils/LogBuilder.js';

export const serverOptionsSchema = z
    .object({
        loglevel: z.nativeEnum(LogLevel).optional(),
        config: z.string().endsWith('.json')
    })
    .transform((value) => new ServerOptions(value.config, value.loglevel));

export default class ServerOptions
{
    #config: string;
    #loglevel?: string;

    constructor(config: string, loglevel = 'info')
    {
        this.#config = config;
        this.#loglevel = loglevel;
    }

    get config() { return this.#config; }

    get loglevel() { return this.#loglevel; }
}
