
import DatabaseError from './DatabaseError';
import Contact from './Contact';

export default async function getContacts(organizationId: number): Promise<Contact[]>
{
    throw new DatabaseError('Oops... Something went wrong');
}
