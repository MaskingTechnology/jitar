
import CharList from './models/CharList';
import Token from './models/Token';
import TokenList from './models/TokenList';

import { isBoolean } from './definitions/Boolean';
import { Comment, isComment } from './definitions/Comment';
import { isDivider } from './definitions/Divider';
import { isEmpty, isNothing } from './definitions/Empty';
import { Group, isGroup } from './definitions/Group';
import { isKeyword } from './definitions/Keyword';
import { List, isList } from './definitions/List';
import { isLiteral } from './definitions/Literal';
import { isNumber, isHexadecimal, isBinary } from './definitions/Number';
import { isOperator, Operator } from './definitions/Operator';
import { isIndicator } from './definitions/Indicator';
import { Punctuation } from './definitions/Punctuation';
import { isScope } from './definitions/Scope';
import { TokenType } from './definitions/TokenType';
import { Whitespace, isWhitespace } from './definitions/Whitespace';

const ESCAPE_CHAR = '\\';

export default class Lexer
{
    tokenize(code: string): TokenList
    {
        const charList = new CharList(code);
        const tokens: Token[] = [];

        let last: Token | undefined = undefined;

        while (charList.notAtEnd())
        {
            const token = this.#getNextToken(charList, last);

            if (token === undefined)
            {
                break;
            }
            else if (token.isType(TokenType.WHITESPACE) || token.isType(TokenType.COMMENT))
            {
                charList.step(); // Skip the token

                continue;
            }

            tokens.push(token);

            if (this.#isCodeToken(token))
            {
                // We want to keep the last token that is an actual part of the code.
                // This is used to determine if a regex is a division or not.
                
                last = token;
            }

            charList.step();
        }

        return new TokenList(tokens);
    }

    #isCodeToken(token: Token): boolean
    {
        return [TokenType.WHITESPACE, TokenType.COMMENT].includes(token.type) === false;
    }

    #getNextToken(charList: CharList, lastToken: Token | undefined): Token | undefined
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
        if (this.#startsRegex(char, lastToken))
        {
            const value = this.#readRegex(charList);
            const end = charList.position;

            return new Token(TokenType.REGEX, value, start, end);
        }
        else if (this.#startsNumber(charList, lastToken))
        {
            const value = this.#readNumber(charList);
            const end = charList.position;

            return new Token(TokenType.NUMBER, value, start, end);
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
        else if (isIndicator(char))
        {
            const value = this.#readOperation(charList);
            const end = charList.position;

            return new Token(TokenType.INDICATOR, value, start, end);
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
        const end = charList.position;

        if (isKeyword(value))
        {
            return new Token(TokenType.KEYWORD, value, start, end);
        }
        else if (isBoolean(value))
        {
            return new Token(TokenType.BOOLEAN, value, start, end);
        }
        else if (isNothing(value))
        {
            return new Token(TokenType.NOTHING, value, start, end);
        }
        
        return new Token(TokenType.IDENTIFIER, value, start, end);
    }

    #readComment(charList: CharList): string
    {
        // Comments are parsed including the start (and optional end) characters.
        // This makes it clear what type of comment it is.

        const identifier = charList.current + charList.next;
        const isMulti = identifier === Comment.MULTI_START;
        const terminator = isMulti ? Comment.MULTI_END : Whitespace.NEWLINE;

        let value = isMulti ? Comment.MULTI_START : Comment.SINGLE;

        charList.step(2);

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

        return isMulti ? value + Comment.MULTI_END : value.trim();
    }

    #startsRegex(char: string, lastToken: Token | undefined): boolean
    {
        // We 'parse' a regex in the lexer to avoid conflicts with literal values.
        // For example, the regex /['"]/g will be parsed as an incorrect literal.
        // This works great for now, but might change in the future if needed.

        if (char !== Operator.DIVIDE)
        {
            return false;
        }
        else if (lastToken === undefined)
        {
            // The code starts with a regex.
            return true;
        }

        // A regex can only be preceded by an operator, divider, keyword or placed in a group / list.
        return [TokenType.OPERATOR, TokenType.DIVIDER, TokenType.KEYWORD].includes(lastToken.type)
            || [Group.OPEN, List.OPEN].includes(lastToken.value);
    }

    #endsRegex(char: string): boolean
    {
        // A regex can only be followed by an identifier.
        // The dot is added to this situation because we treat it as an identifier.
        // This simplifies the whole parsing process, but is important here.

        return isWhitespace(char)
            || char == Punctuation.DOT
            || this.#isIdentifier(char) === false;
    }

    #readRegex(charList: CharList): string
    {
        // A regex is parsed including the start character.

        let value = charList.current;
        let closed = false;

        charList.step();

        while (charList.notAtEnd())
        {
            const current = charList.current;
            const previous = charList.previous;

            if (current === Operator.DIVIDE && previous !== ESCAPE_CHAR)
            {
                closed = true;
            }
            else if (closed === true && this.#endsRegex(current))
            {
                charList.stepBack();

                break;
            }

            value += current;

            charList.step();
        }

        return value;
    }

    #startsNumber(charList: CharList, lastToken: Token | undefined): boolean
    {
        const current = charList.current;
        const next = charList.next;

        if (isNumber(current))
        {
            return true;
        }

        if (current !== Operator.SUBTRACT)
        {
            return false;
        }

        if (lastToken?.isType(TokenType.NUMBER))
        {
            return false;
        }

        return isNumber(next);
    }

    #endsNumber(char: string, hexadecimal: boolean, binary: boolean): boolean
    {
        if (hexadecimal)
        {
            return isHexadecimal(char) === false
                && char !== Punctuation.UNDERSCORE;
        }

        if (binary)
        {
            return isBinary(char) === false
                && char !== Punctuation.UNDERSCORE;
        }

        return isNumber(char) === false
            && char !== Punctuation.DOT
            && char !== Punctuation.UNDERSCORE
            && char !== 'e';
    }

    #readNumber(charList: CharList): string
    {
        let value = charList.current;

        if (value === Operator.SUBTRACT)
        {
            value += charList.step();
        }

        charList.step();

        const hexadecimal = charList.current === 'x';
        const binary = charList.current === 'b';

        if (hexadecimal || binary)
        {
            value += charList.current;

            charList.step();
        }

        while (charList.notAtEnd())
        {
            const char = charList.current;

            if (this.#endsNumber(char, hexadecimal, binary))
            {
                charList.stepBack();

                break;
            }

            value += char;

            charList.step();
        }

        return value;
    }

    #readLiteral(charList: CharList): string
    {
        // Literals are parsed including the start and end characters.
        // This makes it clear what type of literal it is.

        const identifier = charList.current;

        let value = identifier;
        let escaped = false;

        charList.step();

        while (charList.notAtEnd())
        {
            const char = charList.current;

            if (escaped === false)
            {
                if (char === identifier)
                {
                    value += char;

                    break;
                }
                else if (char === ESCAPE_CHAR)
                {
                    escaped = true;
                }
            }
            else
            {
                escaped = false;
            }

            value += char;

            charList.step();
        }

        return value;
    }

    #isIdentifier(char: string): boolean
    {
        // Values like numbers, booleans, null, etc. are parsed as literals.
        // This is because they don't have any meaning in the analysis context.

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
