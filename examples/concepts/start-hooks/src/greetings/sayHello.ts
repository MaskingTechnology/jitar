
import Person from './Person';

export default async function sayHello(person: Person): Promise<string>
{
    return `Hello ${person.fullName}`;
}
