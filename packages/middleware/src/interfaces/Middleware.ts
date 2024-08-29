
import type { Request, Response } from '@jitar/execution';

import NextHandler from '../types/NextHandler.js';

interface Middleware
{
    handle(request: Request, next: NextHandler): Promise<Response>;
}

export default Middleware;