
import { z } from 'zod';

export const nodeDtoSchema = z
    .object({
        url: z.string().url(),
        procedureNames: z.array(z.string()).optional(),
        secret: z.string().optional()
    })
    .strict()
    .transform((value) => new NodeDto(value.url, value.procedureNames));

export default class NodeDto
{
    url: string;
    procedureNames: string[];
    secret?: string;

    constructor(url: string, procedureNames: string[] = [], secret?: string)
    {
        this.url = url;
        this.procedureNames = procedureNames;
        this.secret = secret;
    }
}
