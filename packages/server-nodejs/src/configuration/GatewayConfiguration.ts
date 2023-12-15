
import { z } from 'zod';

import ProcedureRuntimeConfiguration from './ProcedureRuntimeConfiguration';

export const gatewaySchema = z
    .object({
        repository: z.string().url(),
        middlewares: z.array(z.string()).optional(),
        monitor: z.number().optional()
    })
    .strict()
    .transform((value) => new GatewayConfiguration(value.repository, value.middlewares, value.monitor));

export default class GatewayConfiguration extends ProcedureRuntimeConfiguration
{
    #monitor?: number;
    #repository: string;

    constructor(repository: string, middlewares?: string[], monitor?: number)
    {
        super(middlewares);

        this.#monitor = monitor;
        this.#repository = repository;
    }

    get monitor() { return this.#monitor; }

    get repository() { return this.#repository; }
}
