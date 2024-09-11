
import { Segment, ExecutionManager } from '@jitar/execution';
import { HealthCheck, HealthManager } from '@jitar/health';
import { Middleware, MiddlewareManager } from '@jitar/middleware';

import Client from './Client';

type ClientConfiguration =
{
    remoteUrl: string;
    healthChecks: HealthCheck[];
    middleware: Middleware[];
    segments: Segment[];
};

export default class ClientBuilder
{
    build(configuration: ClientConfiguration): Client
    {
        const remoteUrl = configuration.remoteUrl;
        const healthManager = this.#buildHealthManager(configuration.healthChecks);
        const middlewareManager = this.#buildMiddlewareManager(configuration.middleware);
        const executionManager = this.#buildExecutionManager(configuration.segments);

        return new Client({ remoteUrl, healthManager, middlewareManager, executionManager });
    }

    #buildHealthManager(healthChecks: HealthCheck[]): HealthManager
    {
        const manager = new HealthManager();

        healthChecks.forEach(check => manager.addHealthCheck(check));

        return manager;
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
