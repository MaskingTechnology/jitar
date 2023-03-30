
import LocalNode from '../../../src/services/LocalNode';
import NodeBalancer from '../../../src/services/NodeBalancer';

const NODES =
{
    FIRST: new LocalNode(),
    SECOND: new LocalNode()
}

const filledBalancer = new NodeBalancer();
filledBalancer.addNode(NODES.FIRST);
filledBalancer.addNode(NODES.SECOND);

const BALANCERS =
{
    FILLED: filledBalancer,
    EMPTY: new NodeBalancer()
}

export { BALANCERS, NODES }
