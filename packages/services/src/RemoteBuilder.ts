
import Remote from './Remote';

interface RemoteBuilder
{
    build(url: string): Remote;
}

export default RemoteBuilder;
