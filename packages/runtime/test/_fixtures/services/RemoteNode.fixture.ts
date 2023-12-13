
import RemoteNode from '../../../src/services/RemoteNode';

const NODE_URL = 'http://localhost:80';

const NODES =
{
    REMOTE: new RemoteNode(['first', 'second'], NODE_URL)
};

export { NODES, NODE_URL };
