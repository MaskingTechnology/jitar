
interface ClassResolver
{
    resolveKey(clazz: Function): string | undefined;

    resolveClass(key: string): Function | undefined;
}

export default ClassResolver;
