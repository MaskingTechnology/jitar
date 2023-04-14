
import Version from '../../../src/models/Version';

const VERSIONS =
{
    DEFAULT: Version.DEFAULT,
    ACTUAL: new Version(1, 2, 3),
    EQUAL: new Version(1, 2, 3),
    GREATER: new Version(10, 2, 3),
    LESSER: new Version(1, 1, 3),
    MAJOR: new Version(1, 0, 0),
    MAJOR_MINOR: new Version(1, 2, 0)
};

Object.freeze(VERSIONS);

export { VERSIONS };
