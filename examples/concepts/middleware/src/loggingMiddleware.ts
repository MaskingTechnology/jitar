
import { Middleware, Request, Response, NextHandler } from 'jitar';

class LoggingMiddleware implements Middleware
{
    async handle(request: Request, next: NextHandler): Promise<Response>
    {
        // Modify the request here (e.g. add a header)

        const response = await next();

        // Modify the response (result) here

        console.log(`Logging result for ${request.fqn} --> ${response.result}`);

        return response;
    }
}

const instance = new LoggingMiddleware();

export default instance;
