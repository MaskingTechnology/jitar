
import ExecutionManager from '../../src/ExecutionManager';

import { SEGMENTS } from '../models/fixtures';

const generalManager = new ExecutionManager();
generalManager.addSegment(SEGMENTS.GENERAL);

export const EXECUTION_MANAGERS =
{
    GENERAL: generalManager
};
