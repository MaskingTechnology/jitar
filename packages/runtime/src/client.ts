
import type { Segment } from '@jitar/execution';
import type { Middleware } from '@jitar/middleware';
import { ClientBuilder } from '@jitar/services';
import type { Client } from '@jitar/services';

import { setRunner } from './hooks';

export default function buildClient(remoteUrl: string, segments: Segment[] = [], middleware: Middleware[] = []): Client
{
    const clientBuilder = new ClientBuilder();

    const client = clientBuilder.build({ remoteUrl, segments, middleware, healthChecks: [] });

    setRunner(client.worker);

    return client;
}
