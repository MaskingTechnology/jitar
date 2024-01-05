
const Headers =
{
    CONTENT_TYPE: 'Content-Type',
    CONTENT_TYPE_OPTIONS: 'X-Content-Type-Options',
    FRAME_OPTIONS : 'X-Frame-Options'
} as const;

Object.freeze(Headers);

export default Headers;
