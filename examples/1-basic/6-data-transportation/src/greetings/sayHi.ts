
import Person from './Person.js';

export default async function sayHi(person: Person): Promise<string>
{
    return `Hi ${person.firstName}`;
}
