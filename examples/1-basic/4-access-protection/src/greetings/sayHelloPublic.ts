
import sayHello from './sayHello.js';

export default async function sayHelloPublic(firstName: string): Promise<string>
{
    return await sayHello(firstName);
}
