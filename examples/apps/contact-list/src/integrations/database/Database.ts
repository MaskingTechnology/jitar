
import { MongoClient, Db, ObjectId, WithId, Document, Filter } from 'mongodb';

import DatabaseError from './DatabaseError';

class Database
{
    #client?: MongoClient;
    #database?: Db;
    #connected = false;

    get connected(): boolean
    {
        return this.#connected;
    }

    connect(connectionString: string, database: string): void
    {
        try
        {
            this.#client = new MongoClient(connectionString);

            this.#client.on('open', () => { this.#connected = true; });
            this.#client.on('close', () => { this.#connected = false; });
            
            this.#client.on('serverHeartbeatSucceeded', () => { this.#connected = true; });
            this.#client.on('serverHeartbeatFailed', () => { this.#connected = false; });

            this.#database = this.#client.db(database);
        }
        catch (error: unknown)
        {
            throw new DatabaseError('Connection failed');
        }
    }

    async disconnect(): Promise<void>
    {
        if (this.#client === undefined)
        {
            throw new DatabaseError('Database not connected');
        }

        try
        {
            await this.#client.close();

            this.#connected = false;
            this.#database = undefined;
            this.#client = undefined;
        }
        catch (error: unknown)
        {
            throw new DatabaseError('Disconnection failed');
        }
    }

    async create(collectionName: string, document: object): Promise<string>
    {
        const collection = this.#getCollection(collectionName);
        const _id = new ObjectId();

        try
        {
            await collection.insertOne({ _id: _id, ...document } as any);

            return _id.toHexString();
        }
        catch (error: unknown)
        {
            throw new DatabaseError('Create failed');
        }
    }

    async search(collectionName: string, query?: object): Promise<WithId<Document>[]>
    {
        const collection = this.#getCollection(collectionName);

        try
        {
            const documents = await collection.find(query as Filter<Document>).toArray();

            return documents.map(document => ({ ...document, id: document._id.toHexString() }));
        }
        catch (error: unknown)
        {
            throw new DatabaseError('Search failed');
        }
    }

    async delete(collectionName: string, id: string): Promise<void>
    {
        const collection = this.#getCollection(collectionName);

        try
        {
            await collection.deleteOne({ _id: new ObjectId(id) });
        }
        catch (error: unknown)
        {
            throw new DatabaseError('Delete failed');
        }
    }

    #getCollection(collectionName: string)
    {
        if (this.#database === undefined)
        {
            throw new DatabaseError('Database not connected');
        }

        return this.#database.collection(collectionName);
    }
}

const instance = new Database();

export default instance;
