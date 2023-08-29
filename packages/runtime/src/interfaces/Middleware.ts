
import Request from '../models/Request.js';
import Response from '../models/Response.js';

import NextHandler from '../types/NextHandler.js';

interface Middleware
{
    handle(request: Request, next: NextHandler): Promise<Response>;
}

export default Middleware;
