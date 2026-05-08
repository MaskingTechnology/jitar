
const NUMBERS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const HEXADECIMAL = [...NUMBERS, 'a', 'b', 'c', 'd', 'e', 'f', 'A', 'B', 'C', 'D', 'E', 'F'];
const BINARY = ['0', '1'];

function isNumber(value: string): boolean
{
    return NUMBERS.includes(value);
}

function isHexadecimal(value: string): boolean
{
    return HEXADECIMAL.includes(value);
}

function isBinary(value: string): boolean
{
    return BINARY.includes(value);
}

export { isNumber, isHexadecimal, isBinary };
