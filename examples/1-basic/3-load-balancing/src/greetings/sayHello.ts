
export default async function sayHello(firstName = 'World'): Promise<string>
{
    return `Hello ${firstName}`;
}
