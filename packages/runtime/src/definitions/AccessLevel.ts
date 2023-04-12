
const AccessLevel =
{
    PRIVATE: 'private',
    PUBLIC: 'public'
};

Object.freeze(AccessLevel);

const AccessLevels = Object.values(AccessLevel);

Object.freeze(AccessLevels);

export { AccessLevel, AccessLevels };
