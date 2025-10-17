
export default async function sayHello(firstName: string, lastName: string): Promise<string>
{
    return `Hello ${firstName} ${lastName}`;
}
