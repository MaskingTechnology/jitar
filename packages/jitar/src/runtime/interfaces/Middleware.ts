
import Version from '../../core/Version.js';

import NextHandler from '../types/NextHandler.js';

export default interface Middleware
{
    handle(fqn: string, version: Version, args: Map<string, unknown>, headers: Map<string, string>, next: NextHandler): Promise<unknown>;
}
