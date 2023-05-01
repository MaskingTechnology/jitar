
import { names, addresses, phoneNumbers } from './Details.js';

export default async function getOrganizationDetailsV2(id: number): Promise<Record<string, unknown>>
{
    const name = names[id % names.length];
    const address = addresses[id % addresses.length];
    const phoneNumber = phoneNumbers[id % phoneNumbers.length];

    return {
        id: id,
        name: name,
        address: address,
        phoneNumber: phoneNumber
    };
}
