
import type { Request, Response } from '@jitar/execution';

import type NextHandler from '../types/NextHandler';

interface Middleware
{
    handle(request: Request, next: NextHandler): Promise<Response>;
}

export default Middleware;
