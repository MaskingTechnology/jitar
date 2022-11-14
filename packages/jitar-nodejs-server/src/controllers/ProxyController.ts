
import { Controller } from '@overnightjs/core';
import express from 'express';
import expressProxy from 'express-http-proxy';
import { IncomingMessage } from 'http';
import { Logger } from 'tslog';

import { Proxy } from 'jitar';

@Controller('')
export default class ProxyController
{
    #logger: Logger;

    #repositoryUrl: string;
    #runnerUrl: string;

    constructor(app: express.Application, proxy: Proxy, logger: Logger)
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
