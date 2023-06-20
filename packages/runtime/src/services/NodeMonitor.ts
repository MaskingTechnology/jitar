
import LocalGateway from './LocalGateway.js';
import Node from './Node.js';

const DEFAULT_FREQUENCY = 5000;

export default class NodeMonitor
{
    #gateway: LocalGateway;
    #frequency: number;
    #interval: ReturnType<typeof setInterval> | null = null;

    constructor(gateway: LocalGateway, frequency: number = DEFAULT_FREQUENCY)
    {
        this.#gateway = gateway;
        this.#frequency = frequency;
    }

    start(): void
    {
        this.#interval = setInterval(async () => this.#monitor(), this.#frequency);
    }

    stop(): void
    {
        if (this.#interval === null)
        {
            return;
        }

        clearInterval(this.#interval);
    }

    async #monitor(): Promise<void>
    {
        const nodes = this.#gateway.nodes;
        const promises = nodes.map(async (node: Node) => this.#monitorNode(node));

        await Promise.all(promises);
    }

    async #monitorNode(node: Node): Promise<void>
    {
        const available = await this.#checkNodeAvailable(node);

        if (available === false)
        {
            this.#gateway.removeNode(node);
        }
    }

    async #checkNodeAvailable(node: Node): Promise<boolean>
    {
        try
        {
            return await node.isHealthy();
        }
        catch (error)
        {
            return false;
        }
    }
}
