
import { File } from '@jitar/sourcing';

import { CONFIGURATIONS } from './configuration.fixture';
import { FILENAMES } from './filenames.fixture';

export const FILES: Record<string, File> = 
{
    VALID_CONFIGURATION: new File(FILENAMES.VALID_CONFIGURATION, 'text/json', JSON.stringify(CONFIGURATIONS.INPUT.VALID)),
    INVALID_CONFIGURATION: new File(FILENAMES.INVALID_CONFIGURATION, 'text/json', JSON.stringify({})),
} as const;
