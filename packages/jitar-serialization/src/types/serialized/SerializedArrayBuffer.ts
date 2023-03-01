
import Serialized from '../Serialized.js';

type SerializedArrayBuffer = Serialized &
{
    type: string;
    bytes: number[]
}

export default SerializedArrayBuffer;
