
import Resolvable from '../Resolvable';
import Serialized from '../Serialized';

type SerializedClass = Serialized & Resolvable &
{
    args: Record<string, unknown>,
    fields: Record<string, unknown>
}

export default SerializedClass;
