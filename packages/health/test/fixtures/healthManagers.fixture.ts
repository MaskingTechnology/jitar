
import HealthManager from '../../src/HealthManager';

import { HEALTH_CHECKS } from './healthChecks.fixture';

const goodManager = new HealthManager();
goodManager.addHealthCheck(HEALTH_CHECKS.GOOD);

const badManager = new HealthManager();
badManager.addHealthCheck(HEALTH_CHECKS.BAD);

const errorManager = new HealthManager();
errorManager.addHealthCheck(HEALTH_CHECKS.ERROR);

const timeoutManager = new HealthManager();
timeoutManager.addHealthCheck(HEALTH_CHECKS.TIMEDOUT);

const inTimeManager = new HealthManager();
inTimeManager.addHealthCheck(HEALTH_CHECKS.INTIME);

export const HEALTH_MANAGERS =
{
    GOOD: goodManager,
    BAD: badManager,
    ERROR: errorManager,
    TIMEDOUT: timeoutManager,
    INTIME: inTimeManager
};
