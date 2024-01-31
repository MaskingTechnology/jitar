
import { z } from 'zod';
import ConversionError from '../errors/ConversionError';

export default class DataConverter
{
    static convert<Type extends Object>(schema: z.ZodSchema, dataObject: object): Type
    {
        try
        {
            return schema.parse(dataObject);
        }
        catch(error: unknown)
        {
            const errors = (error as z.ZodError).errors;
            const message = JSON.stringify(errors);

            throw new ConversionError(message);
        }
    }
}
