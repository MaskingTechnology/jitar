
import Serialized from '../Serialized.js';

type SerializedTypedArray = Serialized &
{
    type: string;
    bytes: number[]
}

export default SerializedTypedArray;
