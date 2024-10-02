
import Serialized from '../Serialized';

type SerializedMap = Serialized &
{
    entries:
    {
        keys: unknown[],
        values: unknown[]
    }
}

export default SerializedMap;
