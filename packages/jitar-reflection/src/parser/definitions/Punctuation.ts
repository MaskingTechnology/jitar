
const Punctuation =
{
    COMMA: ',',
    COLON: ':',
    SEMICOLON: ';',
    DOT: '.',
    QUESTION_MARK: '?',
    EXCLAMATION_MARK: '!',
    LEFT_PARENTHESIS: '(',
    RIGHT_PARENTHESIS: ')',
    LEFT_BRACKET: '[',
    RIGHT_BRACKET: ']',
    LEFT_BRACE: '{',
    RIGHT_BRACE: '}',
    SINGLE_QUOTE: '\'',
    DOUBLE_QUOTE: '"',
    BACKTICK: '`'
};

const Punctuations = Object.values(Punctuation);

function isPunctuation(value: string): boolean
{
    return Punctuations.includes(value);
}

export { Punctuation, Punctuations, isPunctuation };
