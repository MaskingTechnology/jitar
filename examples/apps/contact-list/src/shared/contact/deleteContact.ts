
import getCollection from '../common/getCollection';
import createId from '../common/createId';

import Contact from './Contact';

export default async function deleteContact(contact: Contact): Promise<void>
{
    const collection = await getCollection('contacts');
    const mongoId = await createId(contact.id);

    await collection.deleteOne({ _id: mongoId });
}
