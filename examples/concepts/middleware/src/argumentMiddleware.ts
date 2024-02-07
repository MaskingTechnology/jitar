
import { Middleware, Request, Response, NextHandler } from 'jitar';

class ArgumentMiddleware implements Middleware
{
    async handle(request: Request, next: NextHandler): Promise<Response>
    {
        // This middleware sets the value of the name parameter to "John Doe" for all requests.
        // The * prefix is used to indicate that the parameter is optional and will only be passed
        // to functions that have a parameter with the same name.

        request.setArgument('*name', 'John Doe');

        const response = await next();

        return response;
    }
}

const instance = new ArgumentMiddleware();

export default instance;
