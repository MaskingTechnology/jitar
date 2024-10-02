
import getSecret from './getSecret';

export default async function checkSecret(secret: number): Promise<boolean>
{
    return secret === await getSecret();
}
