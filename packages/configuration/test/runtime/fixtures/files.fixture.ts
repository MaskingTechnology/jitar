
import { File } from '@jitar/sourcing';

import { CONFIGURATIONS } from './configuration.fixture';
import { FILENAMES } from './filenames.fixture';

export const FILES: Record<string, File> = 
{
    DEFAULT: new File(FILENAMES.DEFAULT, 'text/json', JSON.stringify(CONFIGURATIONS.INPUT.DEFAULT)),
    VALID: new File(FILENAMES.VALID, 'text/json', JSON.stringify(CONFIGURATIONS.INPUT.RUNTIME)),
    BUILD: new File(FILENAMES.BUILD, 'text/json', JSON.stringify(CONFIGURATIONS.INPUT.BUILD)),
    INVALID: new File(FILENAMES.INVALID, 'text/json', JSON.stringify(CONFIGURATIONS.INPUT.INVALID))
} as const;
