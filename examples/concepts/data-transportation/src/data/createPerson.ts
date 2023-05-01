
import Person from './Person.js';

export default async function createPerson(firstName: string, lastName: string): Promise<Person>
{
    return new Person(firstName, lastName);
}
