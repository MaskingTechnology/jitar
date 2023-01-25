
import Version from '../Version.js';

export default interface Runner
{
    run(fqn: string, version: Version, args: Map<string, unknown>, headers: Map<string, string>): Promise<unknown>;
}
