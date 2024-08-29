
import { SourcingManager, ImportFunction, FileManagerBuilder } from '@jitar/sourcing';
import type { Client } from '@jitar/services';

import RuntimeBuilder from './build/RuntimeBuilder';

import { setRuntime } from './hooks';

export default async function buildClient(remoteUrl: string, importFunction: ImportFunction, segmentNames: string[] = [], middlewares: string[] = []): Promise<Client>
{
    const fileManager = new FileManagerBuilder(remoteUrl).buildRemote();
    const sourcingManager = new SourcingManager(fileManager, importFunction);
    const runtimeBuilder = new RuntimeBuilder(sourcingManager);

    const runtime = await runtimeBuilder.buildClient({ remoteUrl, segmentNames, middlewares });

    setRuntime(runtime);

    return runtime;
}
