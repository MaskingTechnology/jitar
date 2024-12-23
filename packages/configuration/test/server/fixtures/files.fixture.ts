
import { File } from '@jitar/sourcing';

import { SERVER_CONFIGURATION } from './configuration.fixture';
import { FILENAMES } from './filenames.fixture';

export const FILES: Record<string, File> = 
{
    VALID_CONFIGURATION: new File(FILENAMES.VALID_CONFIGURATION, 'text/json', JSON.stringify(SERVER_CONFIGURATION)),
    INVALID_CONFIGURATION: new File(FILENAMES.INVALID_CONFIGURATION, 'text/json', JSON.stringify({})),
} as const;
