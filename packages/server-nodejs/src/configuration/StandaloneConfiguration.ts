
import { z } from 'zod';

export const standaloneSchema = z
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
    #source?: string;
    #cache?: string;
    #index?: string;
    #segments?: string[];
    #assets?: string[];

    constructor(source?: string, cache?: string, index?: string, segments?: string[], assets?: string[])
    {
        this.#source = source;
        this.#cache = cache;
        this.#index = index;
        this.#segments = segments;
        this.#assets = assets;
    }

    get source() { return this.#source; }

    get cache() { return this.#cache; }

    get index() { return this.#index; }

    get segments() { return this.#segments; }

    get assets() { return this.#assets; }
}
