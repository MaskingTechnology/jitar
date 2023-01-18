
import Version from '../core/Version.js';

import Gateway from './Gateway.js';
import Middleware from './interfaces/Middleware.js';
import Node from './Node.js';
import Proxy from './Proxy.js';
import NextHandler from './types/NextHandler.js';

export default class ProcedureRunner implements Middleware
{
    #runner: Gateway | Node | Proxy;

    constructor(runner: Gateway | Node | Proxy)
    {
        this.#runner = runner;
    }

    handle(fqn: string, version: Version, args: Map<string, unknown>, headers: Map<string, string>, next: NextHandler): Promise<unknown>
    {
        return this.#runner.run(fqn, version, args);
    }
}
