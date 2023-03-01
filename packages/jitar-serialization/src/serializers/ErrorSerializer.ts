
import ClassSerializer from './ClassSerializer.js';

export default class ErrorSerializer extends ClassSerializer
{
    // Error objects can be serialized by the class serializer.
    // This is unlike other native classes such as Array, Map and Set.
    
    canSerialize(value: unknown): boolean
    {
        return value instanceof Error;
    }
}
