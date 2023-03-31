
import Loadable from '../Loadable.js';
import Serialized from '../Serialized.js';

type SerializedClass = Serialized & Loadable &
{
    args: unknown[],
    fields: Record<string, unknown>
}

export default SerializedClass;
