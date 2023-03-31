
import RemoteNode from '../../../src/services/RemoteNode';

const NODE_URL = 'http://localhost:80';

const NODES =
{
    REMOTE: new RemoteNode(NODE_URL, ['first', 'second'])
}

export { NODES, NODE_URL }
