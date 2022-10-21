
import LocalNode from '../../../src/runtime/LocalNode';
import NodeBalancer from '../../../src/runtime/NodeBalancer';

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
