
import Repository from '../../src/module/models/Repository';

import { MODULES } from './modules';

const REPOSITORY = new Repository(Object.values(MODULES));

export { REPOSITORY };
