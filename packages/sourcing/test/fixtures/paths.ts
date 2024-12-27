
const PATHS =
{
    INPUTS: {
        PATH_TRAVERSAL: '../../../../../../../../../../../../../../../../etc/passwd',
        ABSOLUTE_FILE_PATH: '/jitar/base/test.txt',
        RELATIVE_FILE_PATH: 'test.txt',
        NON_EXISTING_FILE: 'unknown.txt',
        FILE_TYPE_TEXT: 'file.txt',
        FILE_TYPE_UNKNOWN: 'file.test'
    },

    OUTPUTS: {
        PATH_TRAVERSAL: '../../../../../../../../../../../../../../../../etc/passwd',
        ABSOLUTE_FILE_PATH: '/jitar/base/test.txt',
        RELATIVE_FILE_PATH: '/jitar/base/location/test.txt',
        NON_EXISTING_FILE: 'unknown.txt',
        FILE_TYPE_TEXT: 'text/plain',
        FILE_TYPE_UNKNOWN: 'application/octet-stream'
    },

    CONFIGS: {
        BASE_LOCATION: '.',
        ABSOLUTE_PATH: '/jitar/base/location'
    },

    MOCKS: {
        JOIN: {
            PATH_TRAVERSAL: '/etc/passwd',
            RELATIVE_FILE_PATH: '/jitar/base/location/test.txt',
            NON_EXISTING_FILE: '/jitar/base/location/unknown.txt',
            FILE_TYPE_TEXT: '/jitar/base/location/file.txt',
            FILE_TYPE_UNKNOWN: '/jitar/base/location/file.test'
        },

        RESOLVE: {
            ABSOLUTE_FILE_PATH: '/jitar/base/test.txt',
            PATH_TRAVERSAL: '/etc/passwd',
            RELATIVE_FILE_PATH: '/jitar/base/location/test.txt',
            NON_EXISTING_FILE: '/jitar/base/location/unknown.txt',
            FILE_TYPE_TEXT: '/jitar/base/location/file.txt',
            FILE_TYPE_UNKNOWN: '/jitar/base/location/file.test'
        },

        LOOKUP: {
            FILE_TYPE_TEXT: 'text/plain',
            FILE_TYPE_UNKNOWN: false
        },

        EXISTS: {
            NON_EXISTING_FILE: false
        }
    }
} as const;

export default PATHS;
