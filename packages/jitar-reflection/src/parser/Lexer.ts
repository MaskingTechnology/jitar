
import Comment from './definitions/Comment.js';
import Operator from './definitions/Operator.js';
import Punctuation from './definitions/Punctuation.js';
import Reader from './Reader.js';
import Token from './Token.js';
import TokenList from './TokenList.js';
import TokenType from './definitions/TokenType.js';
import Whitespace from './definitions/Whitespace.js';
import Literal from './definitions/Literal.js';

const EMPTY = [undefined, null, ''];
const COMMENT_SINGLE = Comment.SINGLE;
const COMMENT_MULTI_START = Comment.MULTI_START;
const COMMENT_MULTI_END = Comment.MULTI_END;
const WHITESPACE = Object.values(Whitespace);
const OPERATORS = Object.values(Operator);
const LITERALS = Object.values(Literal);
const SEPARATOR = Punctuation.COMMA;
const TERMINATOR = Punctuation.SEMICOLON;
const NEWLINE = Whitespace.NEWLINE;
const SCOPE = [Punctuation.LEFT_BRACE, Punctuation.RIGHT_BRACE];
const GROUP = [Punctuation.LEFT_PARENTHESIS, Punctuation.RIGHT_PARENTHESIS];
const ARRAY = [Punctuation.LEFT_BRACKET, Punctuation.RIGHT_BRACKET];

export default class Lexer
{
    tokenize(code: string): TokenList
    {
        const reader = new Reader(code);
        const tokens: Token[] = [];

        while (reader.eof === false)
        {
            const token = this.#getNextToken(reader);

            if (token === undefined)
            {
                break;
            }

            tokens.push(token);
            
            reader.step();
        }

        return new TokenList(tokens);
    }

    #getNextToken(reader: Reader): Token | undefined
    {
        this.#skipIgnored(reader);

        const char = reader.current;
        const start = reader.position;

        if (this.#isComment(char + reader.next))
        {
            const value = this.#readComment(reader);
            const end = reader.position;

            return new Token(TokenType.COMMENT, value, start, end);
        }
        else if (this.#isLiteral(char))
        {
            const value = this.#readLiteral(reader);
            const end = reader.position;

            return new Token(TokenType.LITERAL, value, start, end);
        }
        else if (this.#isSeparator(char))
        {
            const end = reader.position;

            return new Token(TokenType.SEPARATOR, char, start, end);
        }
        else if (this.#isOperator(char))
        {
            const value = this.#readOperation(reader);
            const end = reader.position;

            return new Token(TokenType.OPERATOR, value, start, end);
        }
        else if (this.#isTerminator(char))
        {
            const end = reader.position;

            return new Token(TokenType.TERMINATOR, char, start, end);
        }
        else if (this.#isGroup(char))
        {
            const end = reader.position;

            return new Token(TokenType.GROUP, char, start, end);
        }
        else if (this.#isScope(char))
        {
            const end = reader.position;

            return new Token(TokenType.SCOPE, char, start, end);
        }
        else if (this.#isArray(char))
        {
            const end = reader.position;

            return new Token(TokenType.SCOPE, char, start, end);
        }
        else if (this.#isEmpty(char))
        {
            return undefined;
        }

        const value = this.#readIdentifier(reader);
        const end = reader.position;

        return new Token(TokenType.IDENTIFIER, value, start, end);
    }

    #isWhiteSpace(char: string): boolean
    {
        return WHITESPACE.includes(char);
    }

    #isLiteral(char: string): boolean
    {
        return LITERALS.includes(char);
    }

    #isOperator(char: string): boolean
    {
        return OPERATORS.includes(char);
    }

    #isSeparator(char: string): boolean
    {
        return char === SEPARATOR;
    }

    #isTerminator(char: string): boolean
    {
        return char === TERMINATOR;
    }

    #isGroup(char: string): boolean
    {
        return GROUP.includes(char);
    }

    #isScope(char: string): boolean
    {
        return SCOPE.includes(char);
    }

    #isArray(char: string): boolean
    {
        return ARRAY.includes(char);
    }

    #isEmpty(char: string): boolean
    {
        return EMPTY.includes(char);
    }

    #isComment(chars: string): boolean
    {
        return chars === COMMENT_SINGLE
            || chars === COMMENT_MULTI_START;
    }

    #isIdentifier(char: string): boolean
    {
        const isOther =
               this.#isEmpty(char)
            || this.#isWhiteSpace(char)
            || this.#isOperator(char)
            || this.#isSeparator(char)
            || this.#isTerminator(char)
            || this.#isGroup(char);

        return isOther === false;
    }

    #skipIgnored(reader: Reader): void
    {
        let inComment = false;

        while (reader.eof === false)
        {
            const char = reader.current;

            if (this.#isComment(char))
            {
                inComment = !inComment;
                
                continue;
            }

            const skip = inComment || this.#isWhiteSpace(char);

            if (skip === false)
            {
                break;
            }

            reader.step();
        }
    }

    #readComment(reader: Reader): string
    {
        const identifier = reader.current + reader.next;
        const isMulti = identifier === COMMENT_MULTI_START;
        const terminator = isMulti ? COMMENT_MULTI_END : NEWLINE;

        reader.step(2);

        let value = '';

        while (reader.eof === false)
        {
            const char = reader.current;
            const check = isMulti ? char + reader.next : char;

            if (check === terminator)
            {
                reader.step(terminator.length - 1);

                break;
            }

            value += char;

            reader.step();
        }

        return value.trim();
    }

    #readLiteral(reader: Reader): string
    {
        const identifier = reader.current;

        let value = '';

        reader.step();

        while (reader.eof === false)
        {
            const char = reader.current;

            if (this.#isLiteral(char) && char === identifier)
            {
                break;
            }

            value += char;

            reader.step();
        }

        return value;
    }

    #readIdentifier(reader: Reader): string
    {
        let value = '';

        while (reader.eof === false)
        {
            const char = reader.current;

            if (this.#isIdentifier(char) === false)
            {
                reader.stepBack();

                break;
            }

            value += char;

            reader.step();
        }

        return value;
    }

    #readOperation(reader: Reader): string
    {
        let value = reader.current;

        reader.step();

        while (reader.eof === false)
        {
            const char = reader.current;

            if (!this.#isOperator(char))
            {
                break;
            }

            value += char;

            reader.step();
        }

        return value;
    }
}
