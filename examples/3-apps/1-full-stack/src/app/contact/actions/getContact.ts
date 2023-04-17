
import getCollection from '../../common/database/getCollection';
import createId from '../../common/database/createId';

import Contact from '../models/Contact';

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
