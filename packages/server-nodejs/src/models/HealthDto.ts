
import { z } from 'zod';

export const schema = z.object({
    healthy: z.boolean(),
    checks: z.map(z.string(), z.boolean())
}).strict().transform((value) => new HealthDto(value.healthy, value.checks));

export default class HealthDto
{
    healthy = false;
    checks: Map<string, boolean> = new Map();

    constructor(healthy: boolean, checks: Map<string, boolean>)
    {
        this.healthy = healthy;
        this.checks = new Map(Object.entries(checks));
    }
}
