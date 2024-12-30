
import { RESPONSES } from './Responses.fixture';

export function dummyFetch(input: RequestInfo, init?: RequestInit): Promise<Response>
{
    const url = input instanceof Request
        ? input.url 
        : input;

    return Promise.resolve(RESPONSES[url] ?? new Response(null, { status: 404 }));
}
