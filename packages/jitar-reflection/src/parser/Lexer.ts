
import CharList from './CharList.js';
import Token from './Token.js';
import TokenList from './TokenList.js';

import { Comment, isComment } from './definitions/Comment.js';
import { Divider, isDivider } from './definitions/Divider.js';
import { isEmpty } from './definitions/Empty.js';
import { Group, isGroup } from './definitions/Group.js';
import { isKeyword } from './definitions/Keyword.js';
import { List, isList } from './definitions/List.js';
import { isLiteral } from './definitions/Literal.js';
import { isOperator, Operator } from './definitions/Operator.js';
import { Punctuation } from './definitions/Punctuation.js';
import { isScope, Scope } from './definitions/Scope.js';
import { TokenType } from './definitions/TokenType.js';
import { Whitespace, isWhitespace } from './definitions/Whitespace.js';

const ESCAPE_CHAR = '\\';

export default class Lexer
{
    tokenize(code: string, omitWhitespace = true, omitComments = true): TokenList
    {
        const charList = new CharList(code);
        const tokens: Token[] = [];

        let previous: Token | undefined = undefined;

        while (charList.notAtEnd())
        {
            const token = this.#getNextToken(charList, previous);

            if (token === undefined)
            {
                break;
            }
            else if (omitWhitespace && token.type === TokenType.WHITESPACE)
            {
                charList.step(); // Skip the whitespace

                continue;
            }
            else if (omitComments && token.type === TokenType.COMMENT)
            {
                charList.step(); // Skip the comment

                continue;
            }

            tokens.push(token);

            if ([TokenType.WHITESPACE, TokenType.COMMENT].includes(token.type) === false)
            {
                // We want to keep the previous token that is an actual part of the code.
                // This is used to determine if a regex is a division or not.

                previous = token;
            }

            charList.step();
        }

        return new TokenList(tokens);
    }

    #getNextToken(charList: CharList, previous: Token | undefined): Token | undefined
    {
        const char = charList.current;
        const start = charList.position;

        if (isWhitespace(char))
        {
            const end = charList.position;

            return new Token(TokenType.WHITESPACE, char, start, end);
        }
        if (isComment(char + charList.next))
        {
            const value = this.#readComment(charList);
            const end = charList.position;

            return new Token(TokenType.COMMENT, value, start, end);
        }
        if (this.#isRegex(char, previous))
        {
            const value = this.#readRegex(charList);
            const end = charList.position;

            return new Token(TokenType.REGEX, value, start, end);
        }
        else if (isLiteral(char))
        {
            const value = this.#readLiteral(charList);
            const end = charList.position;

            return new Token(TokenType.LITERAL, value, start, end);
        }
        else if (isOperator(char))
        {
            const value = this.#readOperation(charList);
            const end = charList.position;

            return new Token(TokenType.OPERATOR, value, start, end);
        }
        else if (isDivider(char))
        {
            const end = charList.position;

            return new Token(TokenType.DIVIDER, char, start, end);
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
        else if (isEmpty(char))
        {
            return undefined;
        }

        const value = this.#readIdentifier(charList);
        const type = isKeyword(value) ? TokenType.KEYWORD : TokenType.IDENTIFIER;
        const end = charList.position;

        return new Token(type, value, start, end);
    }

    #isRegex(char: string, previous: Token | undefined): boolean
    {
        if (char !== Operator.DIVIDE)
        {
            return false;
        }
        else if (previous === undefined)
        {
            // The code starts with a regex.
            
            return true;
        }

        if ([TokenType.IDENTIFIER, TokenType.LITERAL, TokenType.REGEX].includes(previous.type))
        {
            // The previous token has an invalid type to start a regex.

            return false;
        }
        else if ([TokenType.OPERATOR, TokenType.DIVIDER, TokenType.KEYWORD].includes(previous.type))
        {
            // The previous token has a valid type to start a regex.

            return true;
        }

        // The regex can also start in a group or list.

        return [Group.OPEN, List.OPEN].includes(previous.value);
    }

    #isIdentifier(char: string): boolean
    {
        // Values like numbers, booleans, null, etc. are parsed as literals.
        // This is because they don't have any meaning in the reflection context.

        const isOther = isEmpty(char)
                     || isWhitespace(char)
                     || isOperator(char)
                     || isLiteral(char)
                     || isDivider(char)
                     || isGroup(char)
                     || isScope(char)
                     || isList(char);

        return isOther === false;
    }

    #readComment(charList: CharList): string
    {
        // Comments are parsed including the start (and optional end) characters.
        // This makes it clear what type of comment it is.

        const identifier = charList.current + charList.next;
        const isMulti = identifier === Comment.MULTI_START;
        const terminator = isMulti ? Comment.MULTI_END : Whitespace.NEWLINE;

        charList.step(2);

        let value = isMulti ? Comment.MULTI_START : Comment.SINGLE;

        while (charList.notAtEnd())
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

        return isMulti
            ? value + Comment.MULTI_END
            : value .trim();
    }

    #readLiteral(charList: CharList): string
    {
        // Literals are parsed including the start and end characters.
        // This makes it clear what type of literal it is.

        const identifier = charList.current;

        let value = '';
        let escaped = false;

        charList.step();

        while (charList.notAtEnd())
        {
            const char = charList.current;

            if (char === identifier && escaped === false)
            {
                break;
            }
            else if (char === ESCAPE_CHAR && escaped === false)
            {
                escaped = true;
            }
            else if (escaped === true)
            {
                escaped = false;
            }

            value += char;

            charList.step();
        }

        return `${identifier}${value}${identifier}`;
    }

    #readIdentifier(charList: CharList): string
    {
        let value = '';

        while (charList.notAtEnd())
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

    #readRegex(charList: CharList): string
    {
        let value = charList.current;
        let closed = false;

        charList.step();

        while (charList.notAtEnd())
        {
            const char = charList.current;

            if (char === Operator.DIVIDE && charList.previous !== ESCAPE_CHAR)
            {
                closed = true;
            }
            else if (closed === true && (isWhitespace(char) || [Divider.TERMINATOR, Divider.SEPARATOR, Divider.SCOPE, Punctuation.DOT, Whitespace.NEWLINE, Group.CLOSE, List.CLOSE, Scope.CLOSE].includes(char)))
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

        while (charList.notAtEnd())
        {
            const char = charList.current;

            if (isOperator(char) === false || isOperator(value + char) === false)
            {
                charList.stepBack();

                break;
            }

            value += char;

            charList.step();
        }

        return value;
    }
}
