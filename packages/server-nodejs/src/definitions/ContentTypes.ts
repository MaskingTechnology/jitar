
const ContentTypes = {
    NULL: 'custom/null',
    UNDEFINED: 'custom/undefined',
    BOOLEAN: 'custom/boolean',
    NUMBER: 'custom/number',
    JSON: 'application/json',
    TEXT: 'text/plain',
    HTML: 'text/html',
} as const;

Object.freeze(ContentTypes);

export default ContentTypes;
