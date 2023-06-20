
import Serialized from '../Serialized.js';

type SerializedRegExp = Serialized &
{
    source: string,
    flags: string
};

export default SerializedRegExp;
