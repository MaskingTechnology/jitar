
/*
 * Procedures can import classes and make use of class object.
 * 
 * Their data will be serialized and transported to remote procedures.
 */

import Person from './Person';

import sayHi from './sayHi';
import sayHello from './sayHello';

export default async function sayBoth(firstName: string, lastName: string): Promise<string>
{
    const person = new Person(firstName, lastName);

    try
    {
        const hiMessage = await sayHi(person);
        const helloMessage = await sayHello(person);

        return `${hiMessage}\n${helloMessage}`;
    }
    catch (error: any)
    {
        return error.message;
    }
}
