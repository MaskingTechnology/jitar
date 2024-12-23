
const resultConfiguration: Record<string, string | null> =
{
    source: null,
    target: './jitar'
} as const;

const envConfiguration: Record<string, string | null> =
{
    source: '${SOURCE_PATH_ENV_UTIL}',
    target: '${TARGET_PATH_ENV_UTIL}'
} as const;

const envResultConfiguration: Record<string, string | null> =
{
    source: 'null',
    target: './jitar'
} as const;

const emptyConfiguration: Record<string, string | null> = {} as const;

const envVariables: Record<string, string | null> =
{
    TARGET_PATH_ENV_UTIL_KEY: 'TARGET_PATH_ENV_UTIL',
    TARGET_PATH_ENV_UTIL_VALUE: './jitar'
} as const;

export const CONFIGURATIONS: Record<string, any> =
{
    EMPTY: emptyConfiguration,
    RESULT: resultConfiguration,
    ENV: envConfiguration,
    ENV_RESULT: envResultConfiguration,
    ENV_VARIABLES: envVariables
} as const;
