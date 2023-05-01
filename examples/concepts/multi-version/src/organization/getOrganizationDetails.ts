
import { names, addresses } from './Details.js';

export default async function getOrganizationDetails(id: number): Promise<Record<string, unknown>>
{
    const name = names[id % names.length];
    const address = addresses[id % addresses.length];

    return {
        id: id,
        name: name,
        address: address
    }
}
