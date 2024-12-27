
const PATHS =
{
    INPUTS: {
        ABSOLUTE_FILE_PATH: '/jitar/base/location/test.pdf',
        RELATIVE_FILE_PATH: 'test.txt',
        INVALID_FILE_PATH: '../test.txt',
        NON_EXISTING_FILE: 'unknown.txt',
        FILE_TYPE_TEXT: 'file.txt',
        FILE_TYPE_UNKNOWN: 'file.test'
    },

    OUTPUTS: {
        ABSOLUTE_FILE_PATH: '/jitar/base/location/test.pdf',
        RELATIVE_FILE_PATH: '/jitar/base/location/test.txt',
        INVALID_FILE_PATH: '../test.txt',
        NON_EXISTING_FILE: 'unknown.txt',
        FILE_TYPE_TEXT: 'text/plain',
        FILE_TYPE_UNKNOWN: 'application/octet-stream'
    },

    CONFIGS: {
        BASE_LOCATION: '.',
        ROOT_PATH: '/jitar/base/location'
    }
} as const;

export default PATHS;
