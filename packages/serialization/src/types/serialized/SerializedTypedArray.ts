
import Serialized from '../Serialized';

type SerializedTypedArray = Serialized &
{
    type: string;
    bytes: number[]
}

export default SerializedTypedArray;
