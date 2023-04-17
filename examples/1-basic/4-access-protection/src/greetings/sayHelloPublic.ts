
import sayHello from './sayHello';

export default async function sayHelloPublic(firstName: string): Promise<string>
{
    return await sayHello(firstName);
}
