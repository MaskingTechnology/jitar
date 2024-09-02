
type ServerResponse =
{
    result: unknown;
    contentType: string;
    headers: Record<string, string>;
    status: number;
};

export default ServerResponse;
