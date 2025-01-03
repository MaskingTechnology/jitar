
import HttpClient from './interfaces/HttpClient';

export default class FetchHttpClient implements HttpClient
{
    async execute(url: string, options?: RequestInit): Promise<Response>
    {
        return fetch(url, options);
    }
}
