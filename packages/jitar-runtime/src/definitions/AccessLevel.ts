
const AccessLevel =
{
    PRIVATE: 'private',
    PUBLIC: 'public'
};

Object.freeze(AccessLevel);

const AccessLevels = Object.values(AccessLevel);

Object.freeze(AccessLevels);

function isAccessLevel(value: any): boolean
{
    return AccessLevels.includes(value);
}

export { AccessLevel, AccessLevels, isAccessLevel };
