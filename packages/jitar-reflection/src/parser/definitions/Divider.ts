
import { Punctuation } from './Punctuation.js';

const Divider =
{
    SCOPE: Punctuation.COLON,
    SEPARATOR: Punctuation.COMMA,
    TERMINATOR: Punctuation.SEMICOLON
}

const Divisions = Object.values(Divider);

function isDivider(value: string): boolean
{
    return Divisions.includes(value);
}

export { Divider, isDivider };
