
import Serialized from '../Serialized.js';

type SerializedError = Serialized &
{
    type: string;
    stack?: string;
    message: string;
    cause?: unknown;
};

export default SerializedError;
