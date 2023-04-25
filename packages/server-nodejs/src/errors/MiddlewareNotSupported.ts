
export default class MiddlewareNotSupported extends Error
{
    constructor()
    {
        super('Middleware is not supported');
    }
}
