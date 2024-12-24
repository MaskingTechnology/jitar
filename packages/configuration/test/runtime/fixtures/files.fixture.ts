
import { File } from '@jitar/sourcing';

import { CONFIGURATIONS } from './configuration.fixture';
import { FILENAMES } from './filenames.fixture';

export const FILES: Record<string, File> = 
{
    DEFAULT: new File(FILENAMES.DEFAULT, 'text/json', JSON.stringify(CONFIGURATIONS.DEFAULT)),
    VALID: new File(FILENAMES.VALID, 'text/json', JSON.stringify(CONFIGURATIONS.RUNTIME)),
    INVALID: new File(FILENAMES.INVALID, 'text/json', JSON.stringify(CONFIGURATIONS.INVALID))
} as const;
