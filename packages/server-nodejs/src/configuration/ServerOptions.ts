
import { z } from 'zod';
import { LogLevel } from '../utils/LogBuilder.js';

const DEFAULT_BODY_LIMIT = 1024 * 200;

export const serverOptionsSchema = z
    .object({
        loglevel: z.nativeEnum(LogLevel).optional(),
        config: z.string().endsWith('.json'),
        bodylimit: z.number().positive().optional()
    })
    .transform((value) => new ServerOptions(value.config, value.loglevel, value.bodylimit));

export default class ServerOptions
{
    #config: string;
    #loglevel: string;
    #bodylimit: number;

    constructor(config: string, loglevel = 'info', bodylimit = DEFAULT_BODY_LIMIT)
    {
        this.#config = config;
        this.#loglevel = loglevel;
        this.#bodylimit = bodylimit;
    }

    get config() { return this.#config; }

    get loglevel() { return this.#loglevel; }

    get bodylimit() { return this.#bodylimit; }
}
