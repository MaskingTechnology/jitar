
export default class FqnBuilder
{
    static build(module: string, name: string): string
    {
        // Fully qualified name, used to identify procedures
        // Format: module/name (e.g. greetings/sayHello)

        return module !== '' ? `${module}/${name}` : name;
    }
}