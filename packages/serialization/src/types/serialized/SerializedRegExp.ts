
import Serialized from '../Serialized';

type SerializedRegExp = Serialized &
{
    source: string,
    flags: string
};

export default SerializedRegExp;
