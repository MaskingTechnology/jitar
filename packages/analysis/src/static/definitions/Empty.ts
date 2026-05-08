
const Empty =
{
    UNDEFINED: undefined,
    NULL: null,
    STRING: ''
};

const NOTHING = ['null', 'undefined'];

const Empties = Object.values(Empty) as unknown[];

function isEmpty(value: unknown): boolean
{
    return Empties.includes(value);
}

function isNothing(value: string)
{
    return NOTHING.includes(value);
}

export { Empty, isEmpty, isNothing };
