
interface ClassResolver
{
    resolveKey(clazz: Function): string;

    resolveClass(key: string): Function;
}

export default ClassResolver;
