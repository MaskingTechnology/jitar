
const Headers =
{
    JITAR_CONTENT_TYPE: 'X-Jitar-Content-Type',
    CONTENT_TYPE: 'Content-Type',
    CONTENT_TYPE_OPTIONS: 'X-Content-Type-Options',
    FRAME_OPTIONS : 'X-Frame-Options',
    LOCATION: 'Location',
} as const;

Object.freeze(Headers);

export default Headers;
