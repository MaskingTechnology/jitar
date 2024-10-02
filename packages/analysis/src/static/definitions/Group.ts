
import { Punctuation } from './Punctuation';

const Group =
{
    OPEN: Punctuation.LEFT_PARENTHESIS,
    CLOSE: Punctuation.RIGHT_PARENTHESIS
};

function isGroup(value: string): boolean
{
    return value === Group.OPEN || value === Group.CLOSE;
}

export { Group, isGroup };
