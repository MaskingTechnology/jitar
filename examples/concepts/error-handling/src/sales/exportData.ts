
import DatabaseError from './DatabaseError';
import getData from './getData';

export default async function exportData(): Promise<string>
{
    try
    {
        const data = await getData();

        // export data to data warehouse

        return 'Success';
    }
    catch (error: unknown)
    {
        if (error instanceof DatabaseError)
        {
            console.log(`Database error occured`);
        }

        return 'Failed, see log for details';
    }
}
