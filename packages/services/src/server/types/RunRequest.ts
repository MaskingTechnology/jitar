
type RunRequest =
{
    fqn: string;
    version?: string;
    args: Record<string, unknown>;
    headers: Record<string, string>;
};

export default RunRequest;
