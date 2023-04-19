
import { z } from 'zod';

export const schema = z
    .object({
        source: z.string().optional(),
        cache: z.string().optional(),
        index: z.string().optional(),
        assets: z.array(z.string()).optional()
    })
    .strict()
    .transform((value) => new RepositoryConfiguration(value.source, value.cache, value.index, value.assets));

export default class RepositoryConfiguration
{
    source?: string;
    cache?: string;
    index?: string;
    assets?: string[];

    constructor(source?: string, cache?: string, index?: string, assets?: string[])
    {
        this.source = source;
        this.cache = cache;
        this.index = index;
        this.assets = assets;
    }
}
