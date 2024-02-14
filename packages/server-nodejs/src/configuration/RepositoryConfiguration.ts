
import { z } from 'zod';

export const repositorySchema = z
    .object({
        source: z.string().optional(),
        cache: z.string().optional(),
        index: z.string().optional(),
        serveIndexOnNotFound: z.boolean().optional(),
        assets: z.array(z.string()).optional(),
        overrides: z.record(z.string(), z.string()).optional(),
    })
    .strict()
    .transform((value) => new RepositoryConfiguration(value.source, value.cache, value.index, value.serveIndexOnNotFound, value.assets, value.overrides));

export default class RepositoryConfiguration
{
    #source?: string;
    #cache?: string;
    #index?: string;
    #serveIndexOnNotFound?: boolean;
    #assets?: string[];
    #overrides?: Record<string, string>;

    constructor(source?: string, cache?: string, index?: string, serveIndexOnNotFound?: boolean, assets?: string[], overrides?: Record<string, string>)
    {
        this.#source = source;
        this.#cache = cache;
        this.#index = index;
        this.#serveIndexOnNotFound = serveIndexOnNotFound;
        this.#assets = assets;
        this.#overrides = overrides;
    }

    get source() { return this.#source; }

    get cache() { return this.#cache; }

    get index() { return this.#index; }

    get serveIndexOnNotFound() { return this.#serveIndexOnNotFound; }

    get assets() { return this.#assets; }

    get overrides() { return this.#overrides; }
}
