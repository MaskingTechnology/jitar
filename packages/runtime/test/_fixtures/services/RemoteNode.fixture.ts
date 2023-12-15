
import RemoteNode from '../../../src/services/RemoteNode';

const NODE_URL = 'http://localhost:80';

const remoteNode = new RemoteNode(NODE_URL);
remoteNode.procedureNames = new Set(['first', 'second']);

const NODES =
{
    REMOTE: remoteNode
};

export { NODES, NODE_URL };
