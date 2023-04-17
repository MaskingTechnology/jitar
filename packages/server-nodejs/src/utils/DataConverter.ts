
import { z } from 'zod';

export default class DataConverter
{
    static convert<Type extends Object>(schema: z.ZodSchema, dataObject: object): Type
    {
        return schema.parse(dataObject);
    }
}
