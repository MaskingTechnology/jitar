
import ProcedureRuntime from './ProcedureRuntime.js';

export default abstract class Node extends ProcedureRuntime
{
   get trustKey(): string | undefined { return undefined; }
}
