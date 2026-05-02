
const Prefix =
{
    GENERATOR: '*',
    PRIVATE: '#'
};

const Prefixes = Object.values(Prefix);

function isPrefix(value: string): boolean
{
    return Prefixes.includes(value);
}

export { Prefix, isPrefix };
