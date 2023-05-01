
import Contact from '../contact/Contact';
import DatabaseError from '../contact/DatabaseError';
import getContacts from '../contact/getContacts';

export default async function getContactList(organizationId: number): Promise<Contact[]>
{
    try
    {
        return await getContacts(organizationId);
    }
    catch (error: unknown)
    {
        // Note that the error can be checked with instanceof.

        if (error instanceof DatabaseError)
        {
            console.log(error);
        }

        throw error;
    }
}
