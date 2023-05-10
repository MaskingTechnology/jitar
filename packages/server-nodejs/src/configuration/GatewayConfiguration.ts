
import { z } from 'zod';

export const gatewaySchema = z
    .object({
        monitor: z.number().optional(),
        repository: z.string().url().optional()
    })
    .strict()
    .transform((value) => new GatewayConfiguration(value.monitor, value.repository));

export default class GatewayConfiguration
{
    #monitor?: number;
    #repository?: string;

    constructor(monitor?: number, repository?: string)
    {
        this.#monitor = monitor;
        this.#repository = repository;
    }

    get monitor() { return this.#monitor; }

    get repository() { return this.#repository; }
}
