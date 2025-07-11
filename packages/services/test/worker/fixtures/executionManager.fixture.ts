
import { ExecutionManager } from '@jitar/execution';

import { SEGMENTS } from './segments.fixture';
import { sourcingManager } from './sourcingManager.fixture';

export const executionManager = new ExecutionManager(sourcingManager);
executionManager.addSegment(SEGMENTS.FIRST);
executionManager.addSegment(SEGMENTS.SECOND);
