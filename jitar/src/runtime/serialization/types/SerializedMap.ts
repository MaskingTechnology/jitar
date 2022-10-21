
import Serialized from './Serialized.js';

type SerializedMap = Serialized &
{
    entries:
    {
        keys: unknown[],
        values: unknown[]
    }
}

export default SerializedMap;
