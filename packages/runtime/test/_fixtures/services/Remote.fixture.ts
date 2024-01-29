
import Request from '../../../src/models/Request';
import Version from '../../../src/models/Version';

const BOOLEAN_REQUEST = new Request('game/checkSecret', Version.DEFAULT, new Map(), new Map());
const NUMBER_REQUEST = new Request('game/getSecret', Version.DEFAULT, new Map(), new Map());
const OBJECT_REQUEST = new Request('game/scoreSecret', Version.DEFAULT, new Map(), new Map());
const DEFAULT_REQUEST = new Request('game/guessSecret', Version.DEFAULT, new Map(), new Map());

const BOOLEAN_RESPONSE = new Response('false', { status: 200, statusText: 'OK', headers: { 'Content-Type': 'application/boolean' } });
const NUMBER_RESPONSE = new Response('42', { status: 200, statusText: 'OK', headers: { 'Content-Type': 'application/number' } });
const OBJECT_RESPONSE = new Response('{"result":42}', { status: 200, statusText: 'OK', headers: { 'Content-Type': 'application/json' } });
const DEFAULT_RESPONSE = new Response('Sorry, try again', { status: 200, statusText: 'OK', headers: { 'Content-Type': 'text/plain' } });

const REQUESTS = {
    BOOLEAN_REQUEST: BOOLEAN_REQUEST,
    NUMBER_REQUEST: NUMBER_REQUEST,
    OBJECT_REQUEST: OBJECT_REQUEST,
    DEFAULT_REQUEST: DEFAULT_REQUEST
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function customFetch(input: URL | RequestInfo, options: RequestInit | undefined): Promise<Response>
{
    const url = input.toString();

    switch (url)
    {
        case 'http://localhost:3000/rpc/game/checkSecret?version=0.0.0&serialize=true': return Promise.resolve(BOOLEAN_RESPONSE);
        case 'http://localhost:3000/rpc/game/getSecret?version=0.0.0&serialize=true': return Promise.resolve(NUMBER_RESPONSE);
        case 'http://localhost:3000/rpc/game/scoreSecret?version=0.0.0&serialize=true': return Promise.resolve(OBJECT_RESPONSE);
        default: return Promise.resolve(DEFAULT_RESPONSE);
    }
}

globalThis.fetch = customFetch;

export { REQUESTS };
