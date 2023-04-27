
import getSecret from './getSecret';

export default async function checkSecret(secret: string): Promise<boolean>
{
    return secret === await getSecret();
}
