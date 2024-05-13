
import { Middleware, NextHandler, Request, Response } from 'jitar';

import Database from '../database/Database';

class RequestLogger implements Middleware
{
    async handle(request: Request, next: NextHandler): Promise<Response>
    {
        const startTime  = Date.now();
        const response = await next();
        const endTime = Date.now();

        const date = new Date();
        const action = request.fqn;
        const duration = endTime - startTime;

        await Database.create('requests', { date, action, duration });

        return response;
    }
}

const instance = new RequestLogger();

export default instance;
