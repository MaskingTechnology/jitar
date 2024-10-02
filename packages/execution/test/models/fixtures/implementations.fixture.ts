
import { AccessLevels } from '../../../src/definitions/AccessLevel';

import Implementation from '../../../src/models/Implementation';
import Version from '../../../src/models/Version';

import { EXECUTABLES } from './executables.fixture';
import { PARAMETERS } from './parameters.fixture';

export const IMPLEMENTATIONS =
{
    PRIVATE: new Implementation(Version.DEFAULT, AccessLevels.PRIVATE, [], EXECUTABLES.PRIVATE),
    PROTECTED: new Implementation(Version.DEFAULT, AccessLevels.PROTECTED, [], EXECUTABLES.PROTECTED),
    PUBLIC: new Implementation(Version.DEFAULT, AccessLevels.PUBLIC, [], EXECUTABLES.PUBLIC),
    PARAMETERS: new Implementation(Version.DEFAULT, AccessLevels.PRIVATE, [PARAMETERS.MANDATORY, PARAMETERS.OPTIONAL], EXECUTABLES.PARAMETERS),
    BROKEN: new Implementation(Version.DEFAULT, AccessLevels.PRIVATE, [], EXECUTABLES.BROKEN),
    CONTEXT: new Implementation(Version.DEFAULT, AccessLevels.PRIVATE, [], EXECUTABLES.CONTEXT),
    V1_0_0: new Implementation(new Version(1, 0, 0), AccessLevels.PRIVATE, [], EXECUTABLES.V1_0_0),
    V1_0_5: new Implementation(new Version(1, 0, 5), AccessLevels.PRIVATE, [], EXECUTABLES.V1_0_5),
    V1_1_0: new Implementation(new Version(1, 1, 0), AccessLevels.PRIVATE, [], EXECUTABLES.V1_1_0)
};
