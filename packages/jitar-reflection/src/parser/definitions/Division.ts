
import { Punctuation } from './Punctuation.js';

const Division =
{
    SEPARATOR: Punctuation.COMMA,
    TERMINATOR: Punctuation.SEMICOLON
}

function isSeparator(value: string): boolean
{
    return value === Division.SEPARATOR;
}

function isTerminator(value: string): boolean
{
    return value === Division.TERMINATOR;
}

export { Division, isSeparator, isTerminator };
