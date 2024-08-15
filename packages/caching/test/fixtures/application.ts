
import Application from '../../src/application/models/Application';

import { REPOSITORY } from './repository';
import { SEGMENTATION } from './segmentation';

const APPLICATION = new Application(REPOSITORY, SEGMENTATION);

export { APPLICATION };
