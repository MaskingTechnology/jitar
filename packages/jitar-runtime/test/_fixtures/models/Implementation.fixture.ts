
import { AccessLevel } from '../../../src/definitions/AccessLevel'
import Implementation from '../../../src/models/Implementation'
import Version from '../../../src/models/Version'

import { EXECUTABLES } from './Executable.fixture'
import { PARAMETERS } from './Parameter.fixture'

const IMPLEMENTATIONS =
{
    // General
    PRIVATE: new Implementation(Version.DEFAULT, AccessLevel.PRIVATE, [], EXECUTABLES.PRIVATE),
    PUBLIC: new Implementation(Version.DEFAULT, AccessLevel.PUBLIC, [], EXECUTABLES.PUBLIC),
    PARAMETERS: new Implementation(Version.DEFAULT, AccessLevel.PRIVATE, [PARAMETERS.MANDATORY, PARAMETERS.OPTIONAL], EXECUTABLES.PARAMETERS),
    BROKEN: new Implementation(Version.DEFAULT, AccessLevel.PRIVATE, [], EXECUTABLES.BROKEN),
    CONTEXT: new Implementation(Version.DEFAULT, AccessLevel.PRIVATE, [], EXECUTABLES.CONTEXT),
    V1_0_0: new Implementation(new Version(1, 0, 0), AccessLevel.PRIVATE, [], EXECUTABLES.V1_0_0),
    V1_0_5: new Implementation(new Version(1, 0, 5), AccessLevel.PRIVATE, [], EXECUTABLES.V1_0_5),
    V1_1_0: new Implementation(new Version(1, 1, 0), AccessLevel.PRIVATE, [], EXECUTABLES.V1_1_0),

    // First segment
    FIRST: new Implementation(Version.DEFAULT, AccessLevel.PRIVATE, [], EXECUTABLES.FIRST),
    SECOND: new Implementation(Version.DEFAULT, AccessLevel.PUBLIC, [], EXECUTABLES.SECOND),
    THIRD: new Implementation(Version.DEFAULT, AccessLevel.PUBLIC, [], EXECUTABLES.THIRD),

    // Second segment
    FOURTH: new Implementation(Version.DEFAULT, AccessLevel.PUBLIC, [], EXECUTABLES.FOURTH),
    FIFTH: new Implementation(Version.DEFAULT, AccessLevel.PRIVATE, [], EXECUTABLES.FIFTH),
    SIXTH: new Implementation(Version.DEFAULT, AccessLevel.PUBLIC, [], EXECUTABLES.SIXTH)
}

Object.freeze(IMPLEMENTATIONS);

export { IMPLEMENTATIONS }
