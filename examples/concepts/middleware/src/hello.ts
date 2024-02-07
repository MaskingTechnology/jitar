
export default async function hello(name: string): Promise<string>
{
    // The function is called without the name argument.
    // The middleware will set the value of the name argument to "John Doe".

    return `Hello, ${name}!`;
}
