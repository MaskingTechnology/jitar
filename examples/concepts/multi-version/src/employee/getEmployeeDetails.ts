
const names = ['John Doe', 'Jane Doe', 'John Smith', 'Jane Smith', 'John Johnson', 'Jane Johnson'];
const ages = [33, 52, 27, 48, 35, 44];
const addresses = ['123 Main St.', '456 Main St.', '789 Main St.', '123 Elm St.', '456 Elm St.', '789 Elm St.'];

export async function getEmployeeDetails(id: number): Promise<Record<string, unknown>>
{
    const name = names[id % names.length];
    const age = ages[id % ages.length];

    return {
        id: id,
        name: name,
        age: age,
    };
}

export async function getEmployeeDetailsV2(id: number): Promise<Record<string, unknown>>
{
    const name = names[id % names.length];
    const age = ages[id % ages.length];
    const address = addresses[id % addresses.length];

    return {
        id: id,
        name: name,
        age: age,
        address: address,
    };
}
