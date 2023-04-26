
import LocalNode from './services/LocalNode.js';
import RemoteGateway from './services/RemoteGateway.js';
import RemoteRepository from './services/RemoteRepository.js';

let client: LocalNode | undefined = undefined;
const resolvers: ((value: LocalNode) => void)[] = [];

export async function startClient(remoteUrl: string, segmentNames: string[] = []): Promise<LocalNode>
{
    const node = new LocalNode();
    const gateway = new RemoteGateway(remoteUrl);
    const repository = new RemoteRepository(remoteUrl);

    await node.setGateway(gateway);
    await node.setRepository(repository, segmentNames);

    client = node;

    resolvers.forEach((resolve) => resolve(node));

    return node;
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
