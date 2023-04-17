
import getCollection from '../../common/database/getCollection';
import createId from '../../common/database/createId';

import Contact from '../models/Contact';

export default async function deleteContact(contact: Contact): Promise<void>
{
    const collection = await getCollection('contacts');
    const mongoId = await createId(contact.id);

    await collection.deleteOne({ _id: mongoId });
}
