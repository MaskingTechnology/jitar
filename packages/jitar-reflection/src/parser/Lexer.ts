
import CharList from './CharList.js';
import Token from './Token.js';
import TokenList from './TokenList.js';

import { Comment, isComment } from './definitions/Comment.js';
import { isSeparator, isTerminator } from './definitions/Division.js';
import { isGroup } from './definitions/Group.js';
import { isKeyword } from './definitions/Keyword.js';
import { isList } from './definitions/List.js';
import { isLiteral } from './definitions/Literal.js';
import { isOperator } from './definitions/Operator.js';
import { isScope } from './definitions/Scope.js';
import { TokenType } from './definitions/TokenType.js';
import { Whitespace, isWhitespace } from './definitions/Whitespace.js';

const EMPTY = [undefined, null, ''];

export default class Lexer
{
    tokenize(code: string, ignoreComments = true): TokenList
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

            if (ignoreComments && token.type === TokenType.COMMENT)
            {
                charList.step();

                continue;
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

        if (isComment(char + charList.next))
        {
            const value = this.#readComment(charList);
            const end = charList.position;

            return new Token(TokenType.COMMENT, value, start, end);
        }
        else if (isLiteral(char))
        {
            const value = this.#readLiteral(charList);
            const end = charList.position;

            return new Token(TokenType.LITERAL, value, start, end);
        }
        else if (isSeparator(char))
        {
            const end = charList.position;

            return new Token(TokenType.SEPARATOR, char, start, end);
        }
        else if (isOperator(char))
        {
            const value = this.#readOperation(charList);
            const end = charList.position;

            return new Token(TokenType.OPERATOR, value, start, end);
        }
        else if (isTerminator(char))
        {
            const end = charList.position;

            return new Token(TokenType.TERMINATOR, char, start, end);
        }
        else if (isGroup(char))
        {
            const end = charList.position;

            return new Token(TokenType.GROUP, char, start, end);
        }
        else if (isScope(char))
        {
            const end = charList.position;

            return new Token(TokenType.SCOPE, char, start, end);
        }
        else if (isList(char))
        {
            const end = charList.position;

            return new Token(TokenType.LIST, char, start, end);
        }
        else if (this.#isEmpty(char))
        {
            return undefined;
        }

        const value = this.#readIdentifier(charList);
        const type = isKeyword(value) ? TokenType.KEYWORD : TokenType.IDENTIFIER;
        const end = charList.position;

        return new Token(type, value, start, end);
    }

    #isEmpty(char: string): boolean
    {
        return EMPTY.includes(char);
    }

    #isIdentifier(char: string): boolean
    {
        const isOther =
               this.#isEmpty(char)
            || isWhitespace(char)
            || isOperator(char)
            || isSeparator(char)
            || isTerminator(char)
            || isGroup(char)
            || isScope(char)
            || isList(char);

        return isOther === false;
    }

    #skipIgnored(charList: CharList): void
    {
        let inComment = false;

        while (charList.eof === false)
        {
            const char = charList.current;

            if (isComment(char))
            {
                inComment = !inComment;
                
                continue;
            }

            const skip = inComment || isWhitespace(char);

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
        const isMulti = identifier === Comment.MULTI_START;
        const terminator = isMulti ? Comment.MULTI_END : Whitespace.NEWLINE;

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

            if (isLiteral(char) && char === identifier)
            {
                break;
            }

            value += char;

            charList.step();
        }

        return `${identifier}${value}${identifier}`;
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

            if (!isOperator(char))
            {
                break;
            }

            value += char;

            charList.step();
        }

        return value;
    }
}
