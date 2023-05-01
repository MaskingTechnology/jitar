
import createPerson from '../data/createPerson';

export default async function sayHello(firstName: string, lastName: string): Promise<string>
{
    // Note that the Person object is not defined in this file,
    // but it is still fully usable because it is returned by
    // the createPerson function.

    const person = await createPerson(firstName, lastName);

    return `Hello ${person.fullName}`;
}
