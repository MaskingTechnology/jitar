
import { z } from 'zod';

export const schema = z
    .object({
        node: z.string().url().optional(),
        gateway: z.string().url().optional(),
        repository: z.string().url()
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
    .transform((value) => new ProxyConfiguration(value.node, value.gateway, value.repository));

export default class ProxyConfiguration
{
    node?: string;
    gateway?: string;
    repository: string;

    constructor(node: string | undefined, gateway: string | undefined, repository: string)
    {
        this.node = node;
        this.gateway = gateway;
        this.repository = repository;
    }
}
