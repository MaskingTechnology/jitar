
import type { Remote, RemoteBuilder } from '@jitar/services';

import HttpRemote from './HttpRemote';

export default class HttpRemoteBuilder implements RemoteBuilder
{
    build(url: string): Remote
    {
        return new HttpRemote(url, fetch);
    }
}
