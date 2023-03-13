
import SegmentModule from '../../../../src/building/models/SegmentModule';

const module = new SegmentModule('existing.js', []);
const modules = [module];

const existingFilename = 'existing.js';
const nonExistingFilename = 'non-existing.js';

export {
    modules,
    existingFilename, nonExistingFilename
}
