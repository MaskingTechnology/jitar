
import { ValidationScheme } from '../../src';

export const VALIDATION_SCHEMES: Record<string, ValidationScheme> =
{
    STRING: {
        string: { type: 'string', required: true }
    },

    INTEGER: {
        integer: { type: 'integer', required: true }
    },

    REAL: {
        real: { type: 'real', required: true }
    },

    BOOLEAN: {
        boolean: { type: 'boolean', required: true }
    },

    URL: {
        url: { type: 'url', required: true }
    },

    OPTIONAL: {
        string: { type: 'string', required: false },
        integer: { type: 'integer', required: false },
        real: { type: 'real', required: false },
        boolean: { type: 'boolean', required: false },
        url: { type: 'url', required: false }
    },

    GROUP: {
        group: {
            type: 'group',
            required: true,
            fields: {
                string: { type: 'string', required: true },
                integer: { type: 'integer', required: true },
                boolean: { type: 'boolean', required: true }
            }
        }
    },

    LIST: {
        list: {
            type: 'list',
            required: true,
            items: { type: 'string', required: true }
        }
    },

    COMPLEX: {
        complex: {
            type: 'group',
            required: true,
            fields: {
                source: { type: 'string', required: true },
                integer: { type: 'integer', required: true },
                boolean: { type: 'boolean', required: true },
                list: {
                    type: 'list',
                    required: true,
                    items: { type: 'string', required: true }
                }
            }
        }
    },

    STRICT: {
        string: { type: 'string', required: true },
        integer: { type: 'integer', required: false }
    },

    LENIENT: {
        string: { type: 'string', required: true }
    }
};
