
import Node from './Node.js';
import ProcedureRuntime from './ProcedureRuntime.js';

export default abstract class Gateway extends ProcedureRuntime
{
    abstract addNode(node: Node): Promise<void>;
}
