
import Version from '../../../src/core/Version';

const actualVersion = new Version(1, 2, 3);
const equalVersion = new Version(1, 2, 3);
const greaterVersion = new Version(10, 2, 3);
const lesserVersion = new Version(1, 1, 3);
const majorVersion = new Version(1, 0, 0);
const majorMinorVersion = new Version(1, 2, 0);

export {
    actualVersion,
    equalVersion,
    greaterVersion,
    lesserVersion,
    majorVersion,
    majorMinorVersion,
}
