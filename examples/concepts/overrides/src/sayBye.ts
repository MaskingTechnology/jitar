
export default async function sayBye(name = 'World'): Promise<string>
{
    return `Bye ${name}`;
}
