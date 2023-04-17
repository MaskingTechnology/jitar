
import getCollection from '../../common/database/getCollection';

import Contact from '../models/Contact';

export default async function getContacts(): Promise<Contact[]>
{
    const collection = await getCollection('contacts');

    const entries = await collection.find().toArray();

    return mapContacts(entries);
}

function mapContacts(contacts: any[])
{
    return contacts.map(contact => new Contact(contact._id.toHexString(), contact.name, contact.address, contact.phone, contact.email));
}
