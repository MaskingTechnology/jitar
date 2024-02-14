
const RuntimeDefaults =
{
    URL: 'http://localhost:3000',
    SOURCE: './dist',
    CACHE: './.jitar',
    INDEX: 'index.html',
    SERVE_INDEX_ON_NOT_FOUND: false
} as const;

Object.freeze(RuntimeDefaults);

export default RuntimeDefaults;
