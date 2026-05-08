
const BOOLEAN = ['true', 'false'];

function isBoolean(value: string)
{
    return BOOLEAN.includes(value);
}

export { isBoolean };
