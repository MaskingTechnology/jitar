
import LocalNode from '../../../src/services/LocalNode';
import NodeBalancer from '../../../src/services/NodeBalancer';

const firstNode = new LocalNode();
const secondNode = new LocalNode();

const balancer = new NodeBalancer();
balancer.addNode(firstNode);
balancer.addNode(secondNode);

const emptyBalancer = new NodeBalancer();

export {
    balancer,
    emptyBalancer,
    firstNode,
    secondNode
}
