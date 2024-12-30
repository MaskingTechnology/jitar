
import { HTTP_RESPONSES, NOT_FOUND } from './httpResponses.fixture';

export function dummyFetch(input: RequestInfo, init?: RequestInit): Promise<Response>
{
    const url = input instanceof Request
        ? input.url 
        : input;

    return Promise.resolve(HTTP_RESPONSES.get(url) ?? NOT_FOUND);
}
