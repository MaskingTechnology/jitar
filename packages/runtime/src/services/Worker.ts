
import ProcedureRuntime from './ProcedureRuntime.js';

export default abstract class Worker extends ProcedureRuntime
{
   abstract get trustKey(): string | undefined;
}
