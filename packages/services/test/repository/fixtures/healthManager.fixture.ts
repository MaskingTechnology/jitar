
import { HealthManager } from '@jitar/health';

import { sourcingManager } from './sourcingManager.fixture';

export const healthManager = new HealthManager(sourcingManager);
