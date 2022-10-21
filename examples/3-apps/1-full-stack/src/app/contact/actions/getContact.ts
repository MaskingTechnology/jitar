
import getCollection from '../../common/database/getCollection.js';
import createId from '../../common/database/createId.js';

import Contact from '../models/Contact.js';

export default async function getContact(id: string): Promise<Contact | undefined>
{
    const collection = await getCollection('contacts');
    const mongoId = await createId(id);
    
    const entry = await collection.findOne({ _id: mongoId }) as any;

    if (entry === null)
    {
        return undefined;
    }

    return new Contact(entry._id.toHexString(), entry.name, entry.address, entry.phone, entry.email);
}
