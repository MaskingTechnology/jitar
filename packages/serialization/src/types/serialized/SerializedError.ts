
import Serialized from '../Serialized';

type SerializedError = Serialized &
{
    type: string;
    stack?: string;
    message: string;
    cause?: unknown;
};

export default SerializedError;
