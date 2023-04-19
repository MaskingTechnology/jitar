
import { z } from 'zod';

export const schema = z
    .object({
        monitor: z.number().optional(),
        repository: z.string().url().optional()
    })
    .strict()
    .transform((value) => new GatewayConfiguration(value.monitor, value.repository));

export default class GatewayConfiguration
{
    monitor?: number;
    repository?: string;

    constructor(monitor?: number, repository?: string)
    {
        this.monitor = monitor;
        this.repository = repository;
    }
}
