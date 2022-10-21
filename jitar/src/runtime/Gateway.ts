
import Version from '../core/Version.js';

import ProcedureContainer from './interfaces/ProcedureContainer.js';

import Node from './Node.js';
import Runtime from './Runtime.js';

export default abstract class Gateway extends Runtime implements ProcedureContainer
{
    abstract getProcedureNames(): string[];

    abstract hasProcedure(name: string): boolean;

    abstract addNode(node: Node): Promise<void>;

    abstract run(name: string, version: Version, args: Map<string, unknown>): Promise<unknown>;
}
