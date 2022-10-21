
import Runner from '../../core/interfaces/Runner.js';

export default interface ProcedureContainer extends Runner
{
    getProcedureNames(): string[];

    hasProcedure(name: string): boolean;
}
