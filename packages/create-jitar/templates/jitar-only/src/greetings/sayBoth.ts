
import sayHi from './sayHi.js';
import sayHello from './sayHello.js';

export default async function sayBoth(firstName: string, lastName: string): Promise<string>
{
    const hiMessage = await sayHi(firstName);
    const helloMessage = await sayHello(firstName, lastName);

    return `${hiMessage}\n${helloMessage}`;
}
