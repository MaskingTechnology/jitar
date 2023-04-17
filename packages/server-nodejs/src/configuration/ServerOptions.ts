
import { z } from 'zod';
import { LogLevel } from '../utils/LogBuilder.js';

export const schema = z.object({
    loglevel: z.nativeEnum(LogLevel).optional(),
    config: z.string().endsWith('.json').optional()
}).transform((value) => new ServerOptions(value.loglevel, value.config));

export default class ServerOptions
{
    loglevel = 'info';
    config = 'config.json';

    constructor(loglevel = 'info', config = 'config.json')
    {
        this.loglevel = loglevel;
        this.config = config;
    }
}
