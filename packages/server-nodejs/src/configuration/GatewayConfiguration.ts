
import { z } from 'zod';

import ProcedureRuntimeConfiguration from './ProcedureRuntimeConfiguration';

export const gatewaySchema = z
    .object({
        repository: z.string().url(),
        middlewares: z.array(z.string()).optional(),
        monitor: z.number().optional(),
        trustKey: z.string().optional()
    })
    .strict()
    .transform((value) => new GatewayConfiguration(value.repository, value.middlewares, value.monitor, value.trustKey));

export default class GatewayConfiguration extends ProcedureRuntimeConfiguration
{
    #monitor?: number;
    #repository: string;
    #trustKey?: string;

    constructor(repository: string, middlewares?: string[], monitor?: number, trustKey?: string)
    {
        super(middlewares);

        this.#monitor = monitor;
        this.#repository = repository;
        this.#trustKey = trustKey;
    }

    get monitor() { return this.#monitor; }

    get repository() { return this.#repository; }

    get trustKey() { return this.#trustKey; }
}
