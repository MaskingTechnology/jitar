
import { BadRequest, Forbidden, NotFound, NotImplemented, PaymentRequired, ServerError, Teapot, Unauthorized } from '@jitar/errors';

import StatusCodes from '../definitions/StatusCodes';

export default class ErrorConverter
{
    toStatus(error: unknown): number
    {
        if (error instanceof BadRequest) return StatusCodes.BAD_REQUEST;
        if (error instanceof Forbidden) return StatusCodes.FORBIDDEN;
        if (error instanceof NotFound) return StatusCodes.NOT_FOUND;
        if (error instanceof NotImplemented) return StatusCodes.NOT_IMPLEMENTED;
        if (error instanceof PaymentRequired) return StatusCodes.PAYMENT_REQUIRED;
        if (error instanceof Teapot) return StatusCodes.TEAPOT;
        if (error instanceof Unauthorized) return StatusCodes.UNAUTHORIZED;

        return StatusCodes.SERVER_ERROR;
    }

    fromStatus(status: number, message?: string): unknown
    {
        switch (status)
        {
            case StatusCodes.BAD_REQUEST: return new BadRequest(message);
            case StatusCodes.FORBIDDEN: return new Forbidden(message);
            case StatusCodes.NOT_FOUND: return new NotFound(message);
            case StatusCodes.NOT_IMPLEMENTED: return new NotImplemented(message);
            case StatusCodes.PAYMENT_REQUIRED: return new PaymentRequired(message);
            case StatusCodes.TEAPOT: return new Teapot(message);
            case StatusCodes.UNAUTHORIZED: return new Unauthorized(message);
            default: return new ServerError(message);
        }
    }
}
