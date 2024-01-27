
import ProcedureRuntime from './ProcedureRuntime.js';

export default abstract class Node extends ProcedureRuntime
{
   abstract get trustKey(): string | undefined;
}
