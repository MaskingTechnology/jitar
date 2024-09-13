
import Database from '../../integrations/database/Database';

import Contact from './Contact';

export default async function deleteContact(contact: Contact): Promise<void>
{
    // await Database.delete('contacts', contact.id);

    throw new Error('Ha ha ha ha');
}
