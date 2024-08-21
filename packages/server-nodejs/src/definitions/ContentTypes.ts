
const ContentTypes =
{
    BOOLEAN: 'application/boolean',
    NUMBER: 'application/number',
    JSON: 'application/json',
    TEXT: 'text/plain',
    HTML: 'text/html',
} as const;

Object.freeze(ContentTypes);

export default ContentTypes;
