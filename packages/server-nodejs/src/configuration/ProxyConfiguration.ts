
import { z } from 'zod';

import ProcedureRuntimeConfiguration from './ProcedureRuntimeConfiguration';

export const proxySchema = z
    .object({
        node: z.string().url().optional(),
        gateway: z.string().url().optional(),
        repository: z.string().url(),
        middlewares: z.array(z.string()).optional()
    })
    .strict()
    .superRefine((value, ctx) =>
    {
        if (value.node === undefined && value.gateway === undefined)
        {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Either node or gateway must be defined',
                path: ['node', 'gateway']
            });
        }

        if (value.node !== undefined && value.gateway !== undefined)
        {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Only node or gateway must be defined',
                path: ['node', 'gateway'],

            });
        }
    })
    .transform((value) => new ProxyConfiguration(value.node, value.gateway, value.repository, value.middlewares));

export default class ProxyConfiguration extends ProcedureRuntimeConfiguration
{
    #node?: string;
    #gateway?: string;
    #repository: string;

    constructor(node: string | undefined, gateway: string | undefined, repository: string, middlewares?: string[])
    {
        super(middlewares);

        this.#node = node;
        this.#gateway = gateway;
        this.#repository = repository;
    }

    get node() { return this.#node; }

    get gateway() { return this.#gateway; }

    get repository() { return this.#repository; }
}
