
export default class NoDeserializerFound extends Error
{
    constructor(type: string)
    {
        super(`No deserializer found for value of type '${type}'`);
    }
}
