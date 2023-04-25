
import getCollection from '../common/getCollection';
import createId from '../common/createId';

import Contact from './Contact';

export default async function createContact(name: string, address: string, phone: string, email: string): Promise<Contact>
{
    const id = await storeContact(name, address, phone, email);

    return new Contact(id, name, address, phone, email);
}

async function storeContact(name: string, address: string, phone: string, email: string): Promise<string>
{
    const collection = await getCollection('contacts');
    const id = await createId();

    await collection.insertOne({ _id: id, name: name, address: address, phone: phone, email: email } as any);

    return id.toHexString();
}
