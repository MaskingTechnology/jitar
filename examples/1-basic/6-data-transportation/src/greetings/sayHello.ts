
import Person from './Person.js';

export default async function sayHello(person: Person): Promise<string>
{
    return `Hello ${person.fullName}`;
}
