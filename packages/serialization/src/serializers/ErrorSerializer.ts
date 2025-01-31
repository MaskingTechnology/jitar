
import ValueSerializer from '../ValueSerializer';
import SerializedError from '../types/serialized/SerializedError';

export default class ErrorSerializer extends ValueSerializer
{
    canSerialize(value: unknown): boolean
    {
        // This serializer only selects built-in Error objects.
        // Custom error objects are serialized by the class serializer.

        if (value instanceof Object === false)
        {
            return false;
        }

        const error = value;

        return error.constructor === Error
            || error.constructor === EvalError
            || error.constructor === RangeError
            || error.constructor === ReferenceError
            || error.constructor === SyntaxError
            || error.constructor === TypeError
            || error.constructor === URIError
            || error.constructor === AggregateError;
    }

    canDeserialize(value: unknown): boolean
    {
        const error = value as SerializedError;

        return error instanceof Object
            && error.serialized === true
            && error.name === 'Error'
            && error.type in globalThis;  
    }

    async serialize(error: Error): Promise<SerializedError>
    {
        return {
            serialized: true,
            name: 'Error',
            type: error.constructor.name,
            stack: error.stack,
            message: error.message,
            cause: error.cause
        };
    }

    async deserialize(object: SerializedError): Promise<Error>
    {
        const clazz = (globalThis as Record<string, unknown>)[object.type] as (new (message: string, options?: ErrorOptions) => Error);

        const error = new clazz(object.message, { cause: object.cause });
        error.stack = object.stack;

        return error;
    }
}
