
import { RunMode } from '@jitar/execution';

type RunRequest =
{
    fqn: string;
    version?: string;
    args: Record<string, unknown>;
    headers: Record<string, string>;
    mode: RunMode;
};

export default RunRequest;
