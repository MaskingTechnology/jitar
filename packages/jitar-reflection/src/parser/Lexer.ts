
import Comment from './definitions/Comment.js';
import Operator from './definitions/Operator.js';
import Punctuation from './definitions/Punctuation.js';
import TokenType from './definitions/TokenType.js';
import Whitespace from './definitions/Whitespace.js';
import Literal from './definitions/Literal.js';

import CharList from './CharList.js';
import Token from './Token.js';
import TokenList from './TokenList.js';

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
        const charList = new CharList(code);
        const tokens: Token[] = [];

        while (charList.eof === false)
        {
            const token = this.#getNextToken(charList);

            if (token === undefined)
            {
                break;
            }

            tokens.push(token);
            
            charList.step();
        }

        return new TokenList(tokens);
    }

    #getNextToken(charList: CharList): Token | undefined
    {
        this.#skipIgnored(charList);

        const char = charList.current;
        const start = charList.position;

        if (this.#isComment(char + charList.next))
        {
            const value = this.#readComment(charList);
            const end = charList.position;

            return new Token(TokenType.COMMENT, value, start, end);
        }
        else if (this.#isLiteral(char))
        {
            const value = this.#readLiteral(charList);
            const end = charList.position;

            return new Token(TokenType.LITERAL, value, start, end);
        }
        else if (this.#isSeparator(char))
        {
            const end = charList.position;

            return new Token(TokenType.SEPARATOR, char, start, end);
        }
        else if (this.#isOperator(char))
        {
            const value = this.#readOperation(charList);
            const end = charList.position;

            return new Token(TokenType.OPERATOR, value, start, end);
        }
        else if (this.#isTerminator(char))
        {
            const end = charList.position;

            return new Token(TokenType.TERMINATOR, char, start, end);
        }
        else if (this.#isGroup(char))
        {
            const end = charList.position;

            return new Token(TokenType.GROUP, char, start, end);
        }
        else if (this.#isScope(char))
        {
            const end = charList.position;

            return new Token(TokenType.SCOPE, char, start, end);
        }
        else if (this.#isArray(char))
        {
            const end = charList.position;

            return new Token(TokenType.SCOPE, char, start, end);
        }
        else if (this.#isEmpty(char))
        {
            return undefined;
        }

        const value = this.#readIdentifier(charList);
        const end = charList.position;

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

    #skipIgnored(charList: CharList): void
    {
        let inComment = false;

        while (charList.eof === false)
        {
            const char = charList.current;

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

            charList.step();
        }
    }

    #readComment(charList: CharList): string
    {
        const identifier = charList.current + charList.next;
        const isMulti = identifier === COMMENT_MULTI_START;
        const terminator = isMulti ? COMMENT_MULTI_END : NEWLINE;

        charList.step(2);

        let value = '';

        while (charList.eof === false)
        {
            const char = charList.current;
            const check = isMulti ? char + charList.next : char;

            if (check === terminator)
            {
                charList.step(terminator.length - 1);

                break;
            }

            value += char;

            charList.step();
        }

        return value.trim();
    }

    #readLiteral(charList: CharList): string
    {
        const identifier = charList.current;

        let value = '';

        charList.step();

        while (charList.eof === false)
        {
            const char = charList.current;

            if (this.#isLiteral(char) && char === identifier)
            {
                break;
            }

            value += char;

            charList.step();
        }

        return value;
    }

    #readIdentifier(charList: CharList): string
    {
        let value = '';

        while (charList.eof === false)
        {
            const char = charList.current;

            if (this.#isIdentifier(char) === false)
            {
                charList.stepBack();

                break;
            }

            value += char;

            charList.step();
        }

        return value;
    }

    #readOperation(charList: CharList): string
    {
        let value = charList.current;

        charList.step();

        while (charList.eof === false)
        {
            const char = charList.current;

            if (!this.#isOperator(char))
            {
                break;
            }

            value += char;

            charList.step();
        }

        return value;
    }
}
