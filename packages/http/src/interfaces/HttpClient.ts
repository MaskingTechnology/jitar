
interface HttpClient
{
    execute(url: string, options?: RequestInit): Promise<Response>;
}

export default HttpClient;
