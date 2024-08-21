
import { Runner } from '../execution';

import Service from './Service';

export default interface RunnerService extends Runner, Service
{
    getProcedureNames(): string[];

    hasProcedure(name: string): boolean;
}
