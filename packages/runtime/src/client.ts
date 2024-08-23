
import { SourceManager, ImportFunction, RemoteFileManager } from './source';
import type { Client } from './services';

import RuntimeBuilder from './RuntimeBuilder';

export async function startClient(remoteUrl: string, importFunction: ImportFunction, segmentNames: string[] = [], middlewares: string[] = []): Promise<Client>
{
    const fileManager = new RemoteFileManager(remoteUrl);
    const sourceManager = new SourceManager(importFunction, fileManager);
    const runtimeBuilder = new RuntimeBuilder(sourceManager);

    return runtimeBuilder.buildClient({ remoteUrl, segmentNames, middlewares });
}
