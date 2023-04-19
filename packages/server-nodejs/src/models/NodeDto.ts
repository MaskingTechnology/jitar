
import { z } from 'zod';

export const nodeDtoSchema = z
    .object({
        url: z.string().url(),
        procedureNames: z.array(z.string()).optional()
    })
    .strict()
    .transform((value) => new NodeDto(value.url, value.procedureNames));

export default class NodeDto
{
    url: string;
    procedureNames: string[];

    constructor(url: string, procedureNames: string[] = [])
    {
        this.url = url;
        this.procedureNames = procedureNames;
    }
}
