
import Account from './Account.js';

export default async function createAccount(firstName: string, lastName: string): Promise<Account>
{
    return new Account(firstName, lastName);
}
