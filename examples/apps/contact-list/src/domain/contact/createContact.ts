
import Database from '../../integrations/database/Database';

import Contact from './Contact';

export default async function createContact(name: string, address: string, phone: string, email: string): Promise<Contact>
{
    const id = await Database.create('contacts', { name, address, phone, email });

    return new Contact(id, name, address, phone, email);
}
