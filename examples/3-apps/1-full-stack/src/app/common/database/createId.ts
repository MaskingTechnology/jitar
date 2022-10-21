
import { ObjectId } from 'mongodb';

export default async function generateId(inputId?: string): Promise<ObjectId>
{
    return new ObjectId(inputId);
}
