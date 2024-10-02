
export async function getEmployee(id: number): Promise<Record<string, unknown>>
{
    return {
        id: id,
        name: 'John Doe',
        age: 42,
    };
}

export async function getEmployeeV2(uuid: string): Promise<Record<string, unknown>>
{
    return {
        uuid: uuid,
        name: 'John Doe',
        age: 42,
        address: '123 Main St.'
    };
}
