
import Version from '../models/Version.js';

import NextHandler from '../types/NextHandler.js';

interface Middleware
{
    handle(fqn: string, version: Version, args: Map<string, unknown>, headers: Map<string, string>, next: NextHandler): Promise<unknown>;
}

export default Middleware;
