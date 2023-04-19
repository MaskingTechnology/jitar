
import { z } from 'zod';

export const schema = z
    .object({
        gateway: z.string().url().optional(),
        repository: z.string().url().optional(),
        segments: z.array(z.string()).nonempty()
    })
    .strict()
    .transform((value) => new NodeConfiguration(value.gateway, value.repository, value.segments));

export default class NodeConfiguration
{
    gateway?: string;
    repository?: string;
    segments: string[];

    constructor(gateway: string | undefined, repository: string | undefined, segments: string[])
    {
        this.gateway = gateway;
        this.repository = repository;
        this.segments = segments;
    }
}
