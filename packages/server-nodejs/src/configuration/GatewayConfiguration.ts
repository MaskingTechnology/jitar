
import { z } from 'zod';

import ProcedureRuntimeConfiguration from './ProcedureRuntimeConfiguration';

export const gatewaySchema = z
    .object({
        monitor: z.number().optional(),
        repository: z.string().url().optional(),
        middlewares: z.array(z.string()).optional()
    })
    .strict()
    .transform((value) => new GatewayConfiguration(value.monitor, value.repository, value.middlewares));

export default class GatewayConfiguration extends ProcedureRuntimeConfiguration
{
    #monitor?: number;
    #repository?: string;

    constructor(monitor?: number, repository?: string, middlewares?: string[])
    {
        super(middlewares);

        this.#monitor = monitor;
        this.#repository = repository;
    }

    get monitor() { return this.#monitor; }

    get repository() { return this.#repository; }
}
