
type Option =
{
    readonly key: string;
    readonly required: boolean;
    readonly defaultValue?: unknown;
    readonly description: string;
};

export default Option;
