
import type { Remote, RemoteBuilder } from '@jitar/services';

import HttpClient from './interfaces/HttpClient';
import FetchHttpClient from './FetchHttpClient';
import HttpRemote from './HttpRemote';

export default class HttpRemoteBuilder implements RemoteBuilder
{
    readonly #httpClient: HttpClient;

    constructor()
    {
        this.#httpClient = new FetchHttpClient();
    }

    build(url: string): Remote
    {
        return new HttpRemote(url, this.#httpClient);
    }
}
