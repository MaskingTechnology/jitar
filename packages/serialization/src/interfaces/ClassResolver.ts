
export default interface ClassResolver
{
    resolveKey(clazz: Function): string;

    resolveClass(key: string): Function;
}
