
import getCollection from '../common/getCollection';
import createId from '../common/createId';

import Contact from './Contact';
import getContact from './getContact';

export default async function updateContact(id: string, name: string, address: string, phone: string, email: string): Promise<Contact | undefined>
{
    const contact = await getContact(id);

    if (contact === undefined)
    {
        return;
    }

    const collection = await getCollection('contacts');
    const mongoId = await createId(id);

    await collection.updateOne({ _id: mongoId }, { $set: { name: name, address: address, phone: phone, email: email } });

    return contact;
}