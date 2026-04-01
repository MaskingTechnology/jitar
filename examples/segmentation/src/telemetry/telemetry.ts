
import Telemetry from '@theshelf/telemetry';
import { Driver } from '@theshelf/telemetry-driver-otel';
import { Mapping } from '@theshelf/telemetry/dist/definitions/types';

const mappings: Record<string, Mapping> = {
    'reporting/getData': {
        arguments: ['aaa'],
        headers: ['x-jitar-procedure-version']
    }
}

const driver = new Driver('timetrap.rpc');
const telemetry = new Telemetry(driver, mappings);

export default telemetry;
