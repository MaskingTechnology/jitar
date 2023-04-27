
/*
 * This is the first (and default) version of the procedure (version 0.0.0)
 */

export default async function sayHello(name: string = 'World'): Promise<string>
{
    return `Hello ${name}`;
}
