
import Version from '../models/Version.js';

export default interface Runner
{
    run(fqn: string, version: Version, args: Map<string, unknown>, headers: Map<string, string>): Promise<unknown>;
} /* eslint semi: 0 */ //conflicts with TypeScript linter
