
import createAccount from '../account/createAccount';
import Registration from './Registration';

export default async function register(firstName: string, lastName: string): Promise<string>
{
    const account = await createAccount(firstName, lastName);
    const registration = new Registration(account);

    return registration.toString();
}
