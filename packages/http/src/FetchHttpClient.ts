
import HttpClient from './interfaces/HttpClient';

export default class FetchHttpClient implements HttpClient
{
    async execute(url: string, options: object): Promise<Response>
    {
        return fetch(url, options);
    }
}
