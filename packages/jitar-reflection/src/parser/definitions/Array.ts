
import { Punctuation } from './Punctuation.js';

const Array =
{
    OPEN: Punctuation.LEFT_BRACKET,
    CLOSE: Punctuation.RIGHT_BRACKET
}

function isArray(value: string): boolean
{
    return value === Array.OPEN || value === Array.CLOSE;
}

export { Array, isArray };
