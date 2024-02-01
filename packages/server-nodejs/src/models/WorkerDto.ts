
import { z } from 'zod';

export const workerDtoSchema = z
    .object({
        url: z.string().url(),
        procedureNames: z.array(z.string()).optional(),
        trustKey: z.string().optional()
    })
    .strict()
    .transform((value) => new WorkerDto(value.url, value.procedureNames, value.trustKey));

export default class WorkerDto
{
    url: string;
    procedureNames: string[];
    trustKey?: string;

    constructor(url: string, procedureNames: string[] = [], trustKey?: string)
    {
        this.url = url;
        this.procedureNames = procedureNames;
        this.trustKey = trustKey;
    }
}
