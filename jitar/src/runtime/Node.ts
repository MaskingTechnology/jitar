
import Version from '../core/Version.js';

import ProcedureContainer from './interfaces/ProcedureContainer.js';

import Runtime from './Runtime.js';

export default abstract class Node extends Runtime implements ProcedureContainer
{
    abstract getProcedureNames(): string[];

    abstract hasProcedure(name: string): boolean;

    abstract run(name: string, version: Version, args: Map<string, unknown>): Promise<unknown>;
}
