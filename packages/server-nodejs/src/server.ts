
import { ImportFunction } from '@jitar/runtime';

import JitarServer from './JitarServer.js';

export async function buildServer(importFunction: ImportFunction): Promise<JitarServer>
{
    const server = new JitarServer(importFunction);

    await server.build();

    return server;
}
