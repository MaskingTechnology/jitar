
import Request from '../models/Request.js';

import NextHandler from '../types/NextHandler.js';

interface Middleware
{
    handle(request: Request, next: NextHandler): Promise<unknown>;
}

export default Middleware;
