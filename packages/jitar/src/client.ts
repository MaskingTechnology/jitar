
import LocalNode from './runtime/LocalNode.js';
import RemoteGateway from './runtime/RemoteGateway.js';
import RemoteRepository from './runtime/RemoteRepository.js';

let client: LocalNode | undefined = undefined;
const resolvers: ((value: LocalNode) => void)[] = [];

export async function startClient(...segmentFiles: string[]): Promise<LocalNode>
{
    const remoteUrl = document.location.origin;

    const node = new LocalNode();
    const gateway = new RemoteGateway(remoteUrl);
    const repository = new RemoteRepository(remoteUrl);

    await node.setGateway(gateway);
    await node.setRepository(repository, segmentFiles);

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
