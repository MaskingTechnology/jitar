
import { Punctuation } from './Punctuation.js';

const List =
{
    OPEN: Punctuation.LEFT_BRACKET,
    CLOSE: Punctuation.RIGHT_BRACKET
}

function isList(value: string): boolean
{
    return value === List.OPEN || value === List.CLOSE;
}

export { List, isList };
