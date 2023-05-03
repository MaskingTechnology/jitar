
/*
 * This an simple example function that returns a string.
 *
 * Parameters can be mandatory or optional. They will be checked when calling the function.
 * 
 * Important note:
 * All functions have to be async functions in order to be able to split applications.
 */

export default async function sayHello(name = 'World'): Promise<string>
{
    return `Hello ${name}`;
}
