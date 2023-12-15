
import LocalNode from '../../../src/services/LocalNode';
import NodeBalancer from '../../../src/services/NodeBalancer';

import { REPOSITORIES } from './LocalRepository.fixture';

const NODES =
{
    FIRST: new LocalNode(REPOSITORIES.DUMMY),
    SECOND: new LocalNode(REPOSITORIES.DUMMY)
};

const filledBalancer = new NodeBalancer();
filledBalancer.addNode(NODES.FIRST);
filledBalancer.addNode(NODES.SECOND);

const BALANCERS =
{
    FILLED: filledBalancer,
    EMPTY: new NodeBalancer()
};

export { BALANCERS, NODES };
