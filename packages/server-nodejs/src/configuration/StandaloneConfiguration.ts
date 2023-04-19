
import { z } from 'zod';

export const schema = z
    .object({
        source: z.string().optional(),
        cache: z.string().optional(),
        index: z.string().optional(),
        segments: z.array(z.string()).optional(),
        assets: z.array(z.string()).optional()
    })
    .strict()
    .transform((value) => new StandaloneConfiguration(value.source, value.cache, value.index, value.segments, value.assets));

export default class StandaloneConfiguration
{
    source?: string;
    cache?: string;
    index?: string;
    segments?: string[];
    assets?: string[];

    constructor(source?: string, cache?: string, index?: string, segments?: string[], assets?: string[])
    {
        this.source = source;
        this.cache = cache;
        this.index = index;
        this.segments = segments;
        this.assets = assets;
    }
}
