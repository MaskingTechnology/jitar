
import Runner from '../core/interfaces/Runner.js';
import Version from '../core/Version.js';

import NoNodeAvailable from './errors/NoNodeAvailable.js';
import Node from './Node.js';

export default class NodeBalancer implements Runner
{
    #nodes: Node[] = [];
    #currentIndex = 0;

    addNode(node: Node): void
    {
        if (this.#nodes.includes(node))
        {
            return;
        }

        this.#nodes.push(node);
    }

    removeNode(node: Node): void
    {
        const index = this.#nodes.indexOf(node);

        if (index === -1)
        {
            return;
        }

        this.#nodes.splice(index, 1);
    }

    getNextNode(): Node | undefined
    {
        if (this.#nodes.length === 0)
        {
            return;
        }

        if (this.#currentIndex >= this.#nodes.length)
        {
            this.#currentIndex = 0;
        }

        return this.#nodes[this.#currentIndex++];
    }

    async run(fqn: string, version: Version, args: Map<string, unknown>): Promise<unknown>
    {
        const node = this.getNextNode();

        if (node === undefined)
        {
            throw new NoNodeAvailable(fqn);
        }

        return node.run(fqn, version, args);
    }
}
