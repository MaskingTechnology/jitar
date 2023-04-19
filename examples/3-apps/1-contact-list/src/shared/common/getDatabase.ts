
import { MongoClient } from 'mongodb';

import DatabaseError from './DatabaseError';

let client: MongoClient;

export default async function getDatabase()
{
    if (client === undefined)
    {
        client = await createClient();
    }

    return client.db('react-mongodb');
}

async function createClient(): Promise<MongoClient>
{
    try
    {
        return await MongoClient.connect('mongodb://root:example@localhost:27017');
    }
    catch (error: any)
    {
        throw new DatabaseError(error?.message);
    }
}
