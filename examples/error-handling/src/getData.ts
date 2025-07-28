
import DatabaseError from './DatabaseError';

export default async function getData(): Promise<unknown[]>
{
    throw new DatabaseError('Oops... Something went wrong');
}
