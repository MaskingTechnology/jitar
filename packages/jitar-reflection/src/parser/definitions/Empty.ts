
const Empty =
{
    UNDEFINED: undefined,
    NULL: null,
    STRING: ''
}

const Empties = Object.values(Empty) as unknown[];

function isEmpty(value: unknown): boolean
{
    return Empties.includes(value);
}

export { Empty, isEmpty };
