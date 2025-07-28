
import { Middleware, Request, Response, NextHandler } from 'jitar';

class RedirectMiddleware implements Middleware
{
    async handle(request: Request, next: NextHandler): Promise<Response>
    {
        const response = await next();

        if (request.fqn === 'redirect')
        {
            response.setHeader('Location', '/rpc/ping');
        }

        return response;
    }
}

const instance = new RedirectMiddleware();

export default instance;
