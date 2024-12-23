
const resultConfiguration = 
{
    source: null,
    target: './jitar'
} as const;

const envConfiguration =
{
    source: '${SOURCE_PATH_ENV_UTIL}',
    target: '${TARGET_PATH_ENV_UTIL}'
} as const;

const envResultConfiguration =
{
    source: 'null',
    target: './jitar'
} as const;

const defaultConfiguration = {} as const;

const envVariables =
{
    TARGET_PATH_ENV_UTIL_KEY: 'TARGET_PATH_ENV_UTIL',
    TARGET_PATH_ENV_UTIL_VALUE: './jitar'
} as const;

export const CONFIGURATIONS: Record<string, any> =
{
    result: resultConfiguration,
    env: envConfiguration,
    envResult: envResultConfiguration,
    default: defaultConfiguration,
    envVariables
} as const;
