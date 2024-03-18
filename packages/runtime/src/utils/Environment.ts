
const hasWindowObject = typeof window !== 'undefined';

export default class Environment
{
    static isBrowser(): boolean
    {
        return hasWindowObject;
    }

    static isServer(): boolean
    {
        return hasWindowObject === false;
    }
}
