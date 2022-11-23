
import { Application } from 'npm:@types/express@^4.17.13';
import expressProxy from 'npm:express-http-proxy@^1.6.3';
import { IncomingMessage } from 'https://deno.land/std@0.113.0/node/http.ts';
import { Logger } from 'npm:tslog@^3.3.3';

import { Proxy } from 'npm:jitar@^0.2.0';

export default class ProxyController
{
    #logger: Logger;

    #repositoryUrl: string;
    #runnerUrl: string;

    constructor(app: Application, proxy: Proxy, logger: Logger)
    {
        this.#logger = logger;

        this.#repositoryUrl = proxy.repository.url ?? '';
        this.#runnerUrl = proxy.runner.url ?? '';

        app.use('/', expressProxy((message: IncomingMessage): string => this.#selectProxy(message)));
    }

    #selectProxy(message: IncomingMessage): string
    {
        const url = message.url ?? '';

        this.#logger.info(`Forwarding -> ${url}`);

        return url.startsWith('/rpc')
            ? this.#runnerUrl
            : this.#repositoryUrl;
    }
}
