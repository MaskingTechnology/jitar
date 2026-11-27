
import LocationRewriter from '../../../../src/source/module/LocationRewriter';

import { fileManager } from './fileManager.fixture';

const generalRewriter = new LocationRewriter(fileManager);

export const LOCATION_REWRITERS =
{
    GENERAL: generalRewriter
};
