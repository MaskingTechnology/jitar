
import Person from './Person.js';

export default async function sayHello(person: Person): Promise<string>
{
    throw new Error('Oops... Something went wrong');
}
