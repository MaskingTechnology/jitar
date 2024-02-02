
import { z } from 'zod';

import ProcedureRuntimeConfiguration from './ProcedureRuntimeConfiguration';

export const proxySchema = z
    .object({
        worker: z.string().url().optional(),
        gateway: z.string().url().optional(),
        repository: z.string().url(),
        middlewares: z.array(z.string()).optional()
    })
    .strict()
    .superRefine((value, ctx) =>
    {
        if (value.worker === undefined && value.gateway === undefined)
        {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Either worker or gateway must be defined',
                path: ['worker', 'gateway']
            });
        }

        if (value.worker !== undefined && value.gateway !== undefined)
        {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Only worker or gateway must be defined',
                path: ['worker', 'gateway'],

            });
        }
    })
    .transform((value) => new ProxyConfiguration(value.worker, value.gateway, value.repository, value.middlewares));

export default class ProxyConfiguration extends ProcedureRuntimeConfiguration
{
    #worker?: string;
    #gateway?: string;
    #repository: string;

    constructor(worker: string | undefined, gateway: string | undefined, repository: string, middlewares?: string[])
    {
        super(middlewares);

        this.#worker = worker;
        this.#gateway = gateway;
        this.#repository = repository;
    }

    get worker() { return this.#worker; }

    get gateway() { return this.#gateway; }

    get repository() { return this.#repository; }
}
