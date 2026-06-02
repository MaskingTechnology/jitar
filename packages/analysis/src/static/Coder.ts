
import Token from './models/Token';
import { TokenType } from './definitions/TokenType';
import { Keyword } from './definitions/Keyword';

export default class Coder
{
    readonly #tokens: Token[];

    constructor(tokens: Token[] = [])
    {
        this.#tokens = tokens;
    }

    get tokens() { return this.#tokens; }

    append(...tokens: Token[]): void
    {
        this.#tokens.push(...tokens);
    }

    merge(coder: Coder): void
    {
        this.append(...coder.tokens);
    }

    generate(): string
    {
        let code = '';
        let previous: Token = new Token(TokenType.NOTHING, '', 0, 0);

        for (const current of this.#tokens)
        {
            const prefix = this.#needsSpacingBefore(current, previous) ? ' ' : '';
            const postfix = this.#needsSpacingAfter(current) ? ' ' : '';

            code += `${prefix}${current.value}${postfix}`;

            previous = current;
        }

        return code;
    }

    #needsSpacingBefore(current: Token, previous: Token): boolean
    {
        if (current.isType(TokenType.KEYWORD) && this.#isInfixKeyword(current))
        {
            return true;
        }
        else if (previous.isType(TokenType.OPERATOR) && current.isType(TokenType.OPERATOR))
        {
            return true;
        }
        
        return false;
    }

    #needsSpacingAfter(current: Token): boolean
    {
        return current.isType(TokenType.KEYWORD) && this.#isPrefixKeyword(current);
    }

    #isPrefixKeyword(token: Token): boolean
    {
        return this.#isInfixKeyword(token)
            || token.hasValue(Keyword.VAR)
            || token.hasValue(Keyword.LET)
            || token.hasValue(Keyword.CONST)
            || token.hasValue(Keyword.FUNCTION)
            || token.hasValue(Keyword.CLASS)
            || token.hasValue(Keyword.USING)
            || token.hasValue(Keyword.RETURN)
            || token.hasValue(Keyword.ASYNC)
            || token.hasValue(Keyword.AWAIT)
            || token.hasValue(Keyword.YIELD)
            || token.hasValue(Keyword.NEW)
            || token.hasValue(Keyword.THROW);
    }

    #isInfixKeyword(token: Token): boolean
    {
        return token.hasValue(Keyword.OF)
            || token.hasValue(Keyword.IN)
            || token.hasValue(Keyword.AS)
            || token.hasValue(Keyword.FROM);
    }
}
