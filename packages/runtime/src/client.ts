
import LocalNode from './services/LocalNode.js';
import RemoteGateway from './services/RemoteGateway.js';
import RemoteRepository from './services/RemoteRepository.js';

let client: LocalNode | undefined = undefined;
const resolvers: ((client: LocalNode) => void)[] = [];

export async function startClient(remoteUrl: string, segmentNames: string[] = []): Promise<LocalNode>
{
    const repository = new RemoteRepository(remoteUrl);
    const gateway = new RemoteGateway(remoteUrl);
    
    client = new LocalNode(repository, gateway);
    client.segmentNames = new Set(segmentNames);
    
    await client.start();
    
    resolvers.forEach((resolve) => resolve(client as LocalNode));

    return client;
}

export async function getClient(): Promise<LocalNode>
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
