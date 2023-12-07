
import { z } from 'zod';

import ProcedureRuntimeConfiguration from './ProcedureRuntimeConfiguration';

export const nodeSchema = z
    .object({
        gateway: z.string().url().optional(),
        repository: z.string().url().optional(),
        segments: z.array(z.string()).nonempty(),
        middlewares: z.array(z.string()).optional()
    })
    .strict()
    .transform((value) => new NodeConfiguration(value.gateway, value.repository, value.segments, value.middlewares));

export default class NodeConfiguration extends ProcedureRuntimeConfiguration
{
    #gateway?: string;
    #repository?: string;
    #segments: string[];

    constructor(gateway: string | undefined, repository: string | undefined, segments: string[], middlewares?: string[])
    {
        super(middlewares);

        this.#gateway = gateway;
        this.#repository = repository;
        this.#segments = segments;
    }

    get gateway() { return this.#gateway; }

    get repository() { return this.#repository; }

    get segments() { return this.#segments; }
}
