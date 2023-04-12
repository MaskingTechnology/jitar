
export default class NoSerializerFound extends Error
{
    constructor(type: string)
    {
        super(`No serializer found for value of type '${type}'`);
    }
}
