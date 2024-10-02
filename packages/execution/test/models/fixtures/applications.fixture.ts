
import Application from '../../../src/models/Application';

import { SEGMENTS } from './segments.fixture';

const generalApplication = new Application();
generalApplication.addSegment(SEGMENTS.GENERAL);
// TODO: Add more segments

export const APPLICATIONS =
{
    GENERAL: generalApplication
};
