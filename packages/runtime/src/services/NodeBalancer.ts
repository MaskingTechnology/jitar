
import NoNodeAvailable from '../errors/NoNodeAvailable.js';

import Request from '../models/Request.js';

import Node from './Node.js';

export default class NodeBalancer
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

    run(request: Request): Promise<unknown>
    {
        const node = this.getNextNode();

        if (node === undefined)
        {
            throw new NoNodeAvailable(request.fqn);
        }

        return node.run(request);
    }
}
