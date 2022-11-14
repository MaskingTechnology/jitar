
// Static functions are not supported in typescript.
// Therefore all implementations need to export a singleton instance.

export default interface Serializer
{
    serialize(value: unknown): unknown;

    deserialize(value: unknown): Promise<unknown>;
}
