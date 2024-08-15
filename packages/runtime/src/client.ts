
import LocalWorker from './services/LocalWorker.js';
import RemoteGateway from './services/RemoteGateway.js';

let client: LocalWorker | undefined = undefined;
const resolvers: ((client: LocalWorker) => void)[] = [];

export async function startClient(remoteUrl: string, segmentNames: string[] = [], middlewares: string[] = []): Promise<LocalWorker>
{
    const gateway = new RemoteGateway(remoteUrl);

    const worker = new LocalWorker(gateway);
    worker.segmentNames = new Set(segmentNames);
    worker.middlewareFiles = new Set(middlewares);
    
    await worker.start();
    
    client = worker;

    resolvers.forEach((resolve) => resolve(worker));
    resolvers.length = 0;

    return worker;
}

export async function getClient(): Promise<LocalWorker>
{
    if (client === undefined)
    {
        return new Promise((resolve) =>
        {
            resolvers.push(resolve);
        });
    }

    return client;
}
