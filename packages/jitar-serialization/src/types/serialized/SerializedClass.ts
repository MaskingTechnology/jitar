
import FlexObject from '../FlexObject.js';
import Loadable from '../Loadable.js';
import Serialized from '../Serialized.js';

type SerializedClass = Serialized & Loadable &
{
    args: unknown[],
    fields: FlexObject
}

export default SerializedClass;
