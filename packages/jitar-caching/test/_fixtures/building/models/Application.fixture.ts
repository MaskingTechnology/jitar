
import Segment from '../../../../src/building/models/Segment';
import SegmentModule from '../../../../src/building/models/SegmentModule';

const segmentModule = new SegmentModule('existing.js', []);
const segmentModules = [segmentModule];
const segment = new Segment('segment', segmentModules);
const segments = [segment];

const modules = [];

const existingFilename = 'existing.js';
const nonExistingFilename = 'non-existing.js';

export {
    segments, modules,
    existingFilename, nonExistingFilename
}
