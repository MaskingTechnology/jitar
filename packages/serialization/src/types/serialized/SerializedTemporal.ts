
import Serialized from '../Serialized';

type SerializedTemporal = Serialized &
{
    type: string,
    value: string
};

export default SerializedTemporal;
