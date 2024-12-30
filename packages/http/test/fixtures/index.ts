
import { HttpRemote } from '../../src';

import { dummyFetch } from './DummyFetch';

const remote = new HttpRemote('http://dummy.remote', dummyFetch);

export { remote };
