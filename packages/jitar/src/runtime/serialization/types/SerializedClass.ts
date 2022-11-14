
import FlexObject from '../../../core/types/FlexObject.js';

import Serialized from './Serialized.js';

type SerializedClass = Serialized &
{
    source: string | null,
    args: unknown[],
    fields: FlexObject
}

export default SerializedClass;
