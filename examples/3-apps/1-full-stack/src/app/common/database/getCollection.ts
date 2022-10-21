
import { Collection } from 'mongodb';

import getDatabase from './getDatabase.js';

export default async function getCollection<T>(name: string): Promise<Collection<T>>
{
    const database = await getDatabase();

    return database.collection(name);
}
