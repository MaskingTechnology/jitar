
export default interface Command
{
    execute(args: Map<string, string>): Promise<void>;
}
