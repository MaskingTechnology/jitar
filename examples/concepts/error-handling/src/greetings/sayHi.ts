
import Person from './Person';

export default async function sayHi(person: Person): Promise<string>
{
    return `Hi ${person.firstName}`;
}
