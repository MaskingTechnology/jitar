
const RuntimeDefaults =
{
    URL: 'http://localhost:3000',
    SOURCE: './dist',
    CACHE: './.jitar',
    INDEX: 'index.html'
} as const;

Object.freeze(RuntimeDefaults);

export default RuntimeDefaults;
