
import sayHi from './sayHi';
import sayHello from './sayHello';

export default async function sayBoth(firstName: string, lastName: string): Promise<string>
{
    const hiMessage = await sayHi(firstName);
    const helloMessage = await sayHello(firstName, lastName);

    return `${hiMessage}\n${helloMessage}`;
}
