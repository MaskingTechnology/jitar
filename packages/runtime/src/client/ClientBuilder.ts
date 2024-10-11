
import { Segment, ExecutionManager } from '@jitar/execution';
import { RemoteBuilder } from '@jitar/services';
import { Middleware, MiddlewareManager } from '@jitar/middleware';

import Client from './Client';

type ClientConfiguration =
{
    remoteUrl: string;
    middleware?: Middleware[];
    segments?: Segment[];
};

export default class ClientBuilder
{
    readonly #remoteBuilder: RemoteBuilder;

    constructor(remoteBuilder: RemoteBuilder)
    {
        this.#remoteBuilder = remoteBuilder;
    }

    build(configuration: ClientConfiguration): Client
    {
        const remoteUrl = configuration.remoteUrl;
        const remote = this.#remoteBuilder.build(remoteUrl);
        const middlewareManager = this.#buildMiddlewareManager(configuration.middleware ?? []);
        const executionManager = this.#buildExecutionManager(configuration.segments ?? []);

        return new Client({ remoteUrl, remote, middlewareManager, executionManager });
    }

    #buildMiddlewareManager(middleware: Middleware[]): MiddlewareManager
    {
        const manager = new MiddlewareManager();

        middleware.forEach(middleware => manager.addMiddleware(middleware));

        return manager;
    }

    #buildExecutionManager(segments: Segment[]): ExecutionManager
    {
        const manager = new ExecutionManager();

        segments.forEach(segment => manager.addSegment(segment));

        return manager;
    }
}
