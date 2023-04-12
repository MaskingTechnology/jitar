
import { Punctuation } from './Punctuation.js';

const Scope =
{
    OPEN: Punctuation.LEFT_BRACE,
    CLOSE: Punctuation.RIGHT_BRACE
}

function isScope(value: string): boolean
{
    return value === Scope.OPEN || value === Scope.CLOSE;
}

export { Scope, isScope };
