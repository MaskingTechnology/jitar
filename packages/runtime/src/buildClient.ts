
import type { Segment } from '@jitar/execution';
import type { Middleware } from '@jitar/middleware';

import type Client from './client/Client';
import ClientBuilder from './client/ClientBuilder';

import { setRunner } from './hooks';

export default function buildClient(remoteUrl: string, segments: Segment[] = [], middleware: Middleware[] = []): Client
{
    const clientBuilder = new ClientBuilder();

    const client = clientBuilder.build({ remoteUrl, segments, middleware, healthChecks: [] });

    setRunner(client.worker);

    return client;
}
