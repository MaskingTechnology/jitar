
import { ExecutionManager } from '@jitar/execution';

import { SEGMENTS } from './segments.fixture';

export const executionManager = new ExecutionManager();
executionManager.addSegment(SEGMENTS.FIRST);
executionManager.addSegment(SEGMENTS.SECOND);
