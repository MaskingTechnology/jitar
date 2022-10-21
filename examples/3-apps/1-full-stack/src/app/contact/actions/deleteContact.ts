
import getCollection from '../../common/database/getCollection.js';
import createId from '../../common/database/createId.js';

import Contact from '../models/Contact.js';

export default async function deleteContact(contact: Contact): Promise<void>
{
    const collection = await getCollection('contacts');
    const mongoId = await createId(contact.id);

    await collection.deleteOne({ _id: mongoId });
}
