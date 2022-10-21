
import LocalNode from './runtime/LocalNode.js';
import RemoteGateway from './runtime/RemoteGateway.js';
import RemoteRepository from './runtime/RemoteRepository.js';

export async function startClient(...segmentFiles: string[]): Promise<LocalNode>
{
    const remoteUrl = document.location.origin;

    const node = new LocalNode();
    const gateway = new RemoteGateway(remoteUrl);
    const repository = new RemoteRepository(remoteUrl);

    await node.setGateway(gateway);
    await node.setRepository(repository, segmentFiles);

    return node;
}
