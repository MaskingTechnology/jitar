
import { z } from 'zod';

import ProcedureRuntimeConfiguration from './ProcedureRuntimeConfiguration';

export const workerSchema = z
    .object({
        gateway: z.string().url().optional(),
        repository: z.string().url().optional(),
        segments: z.array(z.string()).nonempty(),
        middlewares: z.array(z.string()).optional(),
        trustKey: z.string().optional()
    })
    .strict()
    .transform((value) => new WorkerConfiguration(value.gateway, value.repository, value.segments, value.middlewares, value.trustKey));

export default class WorkerConfiguration extends ProcedureRuntimeConfiguration
{
    #gateway?: string;
    #repository?: string;
    #segments: string[];
    #trustKey?: string;

    constructor(gateway: string | undefined, repository: string | undefined, segments: string[], middlewares?: string[], trustKey?: string)
    {
        super(middlewares);

        this.#gateway = gateway;
        this.#repository = repository;
        this.#segments = segments;
        this.#trustKey = trustKey;
    }

    get gateway() { return this.#gateway; }

    get repository() { return this.#repository; }

    get segments() { return this.#segments; }

    get trustKey() { return this.#trustKey; }
}
