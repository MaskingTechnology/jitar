
import HealthCheck from '../../../src/interfaces/HealthCheck';
import LocalNode from '../../../src/services/LocalNode';
import LocalGateway from '../../../src/services/LocalGateway';
import NodeMonitor from '../../../src/services/NodeMonitor';

class HealthyCheck implements HealthCheck
{
    async isHealthy(): Promise<boolean> { return true; }
}

class UnhealthyCheck implements HealthCheck
{
    async isHealthy(): Promise<boolean> { return false; }
}

const goodNode = new LocalNode();
goodNode.addHealthCheck('good', new HealthyCheck());

const badNode = new LocalNode();
badNode.addHealthCheck('bad', new UnhealthyCheck());

const gateway = new LocalGateway('http://localhost:80');
gateway.addNode(goodNode);
gateway.addNode(badNode);

const monitor = new NodeMonitor(gateway, 100);

export {
    goodNode,
    badNode,
    gateway,
    monitor
}
