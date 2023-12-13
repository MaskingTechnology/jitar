
export default async function sayHello(name = 'World'): Promise<string>
{
    return `Hello ${name}`;
}
