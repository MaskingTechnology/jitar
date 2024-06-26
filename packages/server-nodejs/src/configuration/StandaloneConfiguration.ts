
import { z } from 'zod';

import ProcedureRuntimeConfiguration from './ProcedureRuntimeConfiguration';

export const standaloneSchema = z
    .object({
        source: z.string().optional(),
        cache: z.string().optional(),
        index: z.string().optional(),
        serveIndexOnNotFound: z.boolean().optional(),
        segments: z.array(z.string()).optional(),
        assets: z.array(z.string()).optional(),
        middlewares: z.array(z.string()).optional(),
        overrides: z.record(z.string(), z.string()).optional(),
        trustKey: z.string().optional()
    })
    .strict()
    .transform((value) => new StandaloneConfiguration(value.source, value.cache, value.index, value.serveIndexOnNotFound, value.segments, value.assets, value.middlewares, value.overrides, value.trustKey));

export default class StandaloneConfiguration extends ProcedureRuntimeConfiguration
{
    #source?: string;
    #cache?: string;
    #index?: string;
    #serveIndexOnNotFound?: boolean;
    #segments?: string[];
    #assets?: string[];
    #overrides?: Record<string, string>;
    #trustKey?: string;

    constructor(source?: string, cache?: string, index?: string, serveIndexOnNotFound?: boolean, segments?: string[], assets?: string[], middlewares?: string[], overrides?: Record<string, string>, trustKey?: string)
    {
        super(middlewares);

        this.#source = source;
        this.#cache = cache;
        this.#index = index;
        this.#serveIndexOnNotFound = serveIndexOnNotFound;
        this.#segments = segments;
        this.#assets = assets;
        this.#overrides = overrides;
        this.#trustKey = trustKey;
    }

    get source() { return this.#source; }

    get cache() { return this.#cache; }

    get index() { return this.#index; }

    get serveIndexOnNotFound() { return this.#serveIndexOnNotFound; }

    get segments() { return this.#segments; }

    get assets() { return this.#assets; }

    get overrides() { return this.#overrides; }

    get trustKey() { return this.#trustKey; }
}
