
import { Runner } from '@jitar/execution';

import Service from './Service';

interface RunnerService extends Runner, Service
{
    get trustKey(): string | undefined;
    
    getProcedureNames(): string[];

    hasProcedure(name: string): boolean;
}

export default RunnerService;
