
import Remote from './Remote';

export default interface RemoteBuilder
{
    build(url: string): Remote;
}
