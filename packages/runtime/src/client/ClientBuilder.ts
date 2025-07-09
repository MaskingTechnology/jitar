
import { Segment, ExecutionManager } from '@jitar/execution';
import { RemoteBuilder } from '@jitar/services';
import { HealthManager } from '@jitar/health';
import { Middleware, MiddlewareManager } from '@jitar/middleware';
import { RemoteSourcingManager } from '@jitar/sourcing';

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
        const middleware = configuration.middleware;
        const segments = configuration.segments;

        const remote = this.#remoteBuilder.build(remoteUrl);
        const sourcingManager = new RemoteSourcingManager(remoteUrl);
        const healthManager = this.#buildHealthManager(sourcingManager);
        const middlewareManager = this.#buildMiddlewareManager(sourcingManager, middleware);
        const executionManager = this.#buildExecutionManager(sourcingManager, segments);

        return new Client({ remoteUrl, remote, healthManager, middlewareManager, executionManager });
    }

    #buildHealthManager(sourcingManager: RemoteSourcingManager): HealthManager
    {
        return new HealthManager(sourcingManager);
    }

    #buildMiddlewareManager(sourcingManager: RemoteSourcingManager, middleware: Middleware[] = []): MiddlewareManager
    {
        const manager = new MiddlewareManager(sourcingManager);

        middleware.forEach(middleware => manager.addMiddleware(middleware));

        return manager;
    }

    #buildExecutionManager(sourcingManager: RemoteSourcingManager, segments: Segment[] = []): ExecutionManager
    {
        const manager = new ExecutionManager(sourcingManager);

        segments.forEach(segment => manager.addSegment(segment));

        return manager;
    }
}
