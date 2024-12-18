
import getSecret from '../getSecret';
import database from '../../integrations/module';

export default async function checkSecret(secret: number): Promise<boolean>
{
    console.log('Checking secret...');

    database();

    return secret === await getSecret();
}
