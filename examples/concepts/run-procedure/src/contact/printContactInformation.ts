
import { Contact, ContactV2 } from '../model/Contact';

export default async function printContactInformation(contact: Contact): Promise<string>
{
    return `name\t\t: ${contact.name}\nemail\t\t: ${contact.email}`;
}

export async function printContactInformationV2(contact: ContactV2): Promise<string>
{
    return `lastName\t: ${contact.lastName}\nfirstName\t: ${contact.firstName}\nemails\t\t: ${contact.emails.join(', ')}`;
}
