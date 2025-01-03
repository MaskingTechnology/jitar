
interface HttpClient
{
    execute(url: string, options: object): Promise<Response>;
}

export default HttpClient;
