
import DummyRepository from '../../../src/services/DummyRepository';
import LocalRepository from '../../../src/services/LocalRepository';

import { TestFileManager } from '../interfaces/FileManager.fixture';
import { SEGMENT_FILES } from '../models/Segment.fixture';

const CLIENT = { id: '' };

const defaultRepository = new LocalRepository(new TestFileManager());
defaultRepository.assets = new Set(['index.html']);

await defaultRepository.registerSegment('first', SEGMENT_FILES.FIRST);
await defaultRepository.registerSegment('second', SEGMENT_FILES.SECOND);
await defaultRepository.registerClient(['first']).then(clientId => CLIENT.id = clientId);

const dummyRepository = new DummyRepository();

const REPOSITORIES =
{
    DEFAULT: defaultRepository,
    DUMMY: dummyRepository
};

Object.freeze(REPOSITORIES);

const REPOSITORY_FILES =
{
    UNSEGMENTED: SEGMENT_FILES.GENERAL[0],
    LOCAL: SEGMENT_FILES.FIRST[0],
    REMOTE: SEGMENT_FILES.SECOND[0]
};

Object.freeze(REPOSITORY_FILES);

export { REPOSITORIES, REPOSITORY_FILES, CLIENT };
