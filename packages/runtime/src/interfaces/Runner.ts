
import Version from '../models/Version.js';

interface Runner
{
    run(fqn: string, version: Version, args: Map<string, unknown>, headers: Map<string, string>): Promise<unknown>;
}

export default Runner;
