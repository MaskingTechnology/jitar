
import HttpClient from '../../src/interfaces/HttpClient';

import { HTTP_RESPONSES, NOT_FOUND } from './httpResponses.fixture';

export class TestHttpClient implements HttpClient
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async execute(url: string, options: object): Promise<Response>
    {
        return Promise.resolve(HTTP_RESPONSES[url] ?? NOT_FOUND);
    }
}
