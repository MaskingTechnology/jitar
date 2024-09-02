
const StatusCodes =
{
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    PAYMENT_REQUIRED: 402,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    TEAPOT: 418,
    SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501
} as const;

export default StatusCodes;
