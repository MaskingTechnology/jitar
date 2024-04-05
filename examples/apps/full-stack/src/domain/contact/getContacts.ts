
import Database from '../../integrations/database/Database';

import Contact from './Contact';

export default async function getContacts(): Promise<Contact[]>
{
    const documents = await Database.search('contacts');

    return documents.map(document => new Contact(document.id, document.name, document.address, document.phone, document.email));
}
