
const NUMBERS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

function isNumber(value: string): boolean
{
    return NUMBERS.includes(value);
}

export { isNumber };
