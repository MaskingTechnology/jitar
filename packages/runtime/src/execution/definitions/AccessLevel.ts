
const AccessLevels =
{
    PRIVATE: 'private',
    PROTECTED: 'protected',
    PUBLIC: 'public'
} as const;

type Keys = keyof typeof AccessLevels;
type AccessLevel = typeof AccessLevels[Keys];

export { AccessLevels, AccessLevel };
