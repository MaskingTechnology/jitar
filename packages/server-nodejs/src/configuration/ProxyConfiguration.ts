
import { z } from 'zod';

export const schema = z.object({
    node: z.string().url().optional(),
    gateway: z.string().url().optional(),
    repository: z.string().url().optional()
}).strict().transform((value) => new ProxyConfiguration(value.node, value.gateway, value.repository));

export default class ProxyConfiguration
{
    node?: string;
    gateway?: string;
    repository?: string;

    constructor(node?: string, gateway?: string, repository?: string)
    {
        this.node = node;
        this.gateway = gateway;
        this.repository = repository;
    }
}
