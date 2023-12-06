
import database from './database';

export default async function getData(): Promise<string>
{
    let data: string = '';

    for (const [key, value] of database)
    {
        data += `${key} => ${value}\n`;
    }

    return data;
}
