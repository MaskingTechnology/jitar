
import { z } from 'zod';

import ProcedureRuntimeConfiguration from './ProcedureRuntimeConfiguration';

export const gatewaySchema = z
    .object({
        repository: z.string().url(),
        middlewares: z.array(z.string()).optional(),
        monitor: z.number().optional(),
        secret: z.string().optional()
    })
    .strict()
    .transform((value) => new GatewayConfiguration(value.repository, value.middlewares, value.monitor, value.secret));

export default class GatewayConfiguration extends ProcedureRuntimeConfiguration
{
    #monitor?: number;
    #repository: string;
    #secret?: string;

    constructor(repository: string, middlewares?: string[], monitor?: number, secret?: string)
    {
        super(middlewares);

        this.#monitor = monitor;
        this.#repository = repository;
        this.#secret = secret;
    }

    get monitor() { return this.#monitor; }

    get repository() { return this.#repository; }

    get secret() { return this.#secret; }
}
