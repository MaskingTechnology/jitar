
const HeaderKeys =
{
    CONTENT_TYPE: 'content-type',
    CONTENT_LENGTH: 'content-length',
    CONTENT_TYPE_OPTIONS: 'x-content-type-options',
    JITAR_CONTENT_TYPE: 'x-jitar-content-type',
    JITAR_PROCEDURE_VERSION: 'x-jitar-procedure-version',
    X_FORWARDED_PROTO: 'x-forwarded-proto',
    X_FORWARDED_HOST: 'x-forwarded-host',
    X_FORWARDED_FOR: 'x-forwarded-for',
    POWERED_BY: 'x-powered-by'
} as const;

export default HeaderKeys;
