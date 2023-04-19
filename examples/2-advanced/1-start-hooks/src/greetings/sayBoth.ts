
import Person from './Person';

import sayHi from './sayHi';
import sayHello from './sayHello';

export default async function sayBoth(firstName: string, lastName: string): Promise<string>
{
    const person = new Person(firstName, lastName);

    const hiMessage = await sayHi(person);
    const helloMessage = await sayHello(person);

    return `${hiMessage}\n${helloMessage}`;
}
