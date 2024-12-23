
import { File } from '@jitar/sourcing';

import { FILENAMES } from './filenames.fixture';
import { CONFIGURATIONS } from './configuration.fixture';

export const FILES: Record<string, File> = 
{
    CORRECT_TYPE: new File(FILENAMES.CORRECT_TYPE, 'text/json', JSON.stringify(CONFIGURATIONS.result)),
    INCORRECT_TYPE: new File(FILENAMES.INCORRECT_TYPE, 'text/plain', 'source: null\ntarget: .jitar'),
    ENV_VARIABLES: new File(FILENAMES.ENV_VARIABLES, 'text/json', JSON.stringify(CONFIGURATIONS.env))
} as const;
