
import Token from './models/Token';
import { TokenType } from './definitions/TokenType';
import { isDeclaration, Keyword } from './definitions/Keyword';

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
            const glue = this.#needsSpacing(previous, current) ? ' ' : '';

            code += `${glue}${current.value}`;

            previous = current;
        }

        return code;
    }

    #needsSpacing(previous: Token, current: Token): boolean
    {
        if (previous.isType(TokenType.KEYWORD) && this.#isSpacedKeyword(previous))
        {
            return true;
        }
        if (previous.isType(TokenType.OPERATOR) && current.isType(TokenType.OPERATOR))
        {
            return true;
        }
        
        return false;
    }

    #isSpacedKeyword(token: Token): boolean
    {
        return isDeclaration(token.value)
            || token.hasValue(Keyword.RETURN)
            || token.hasValue(Keyword.ASYNC)
            || token.hasValue(Keyword.AWAIT)
            || token.hasValue(Keyword.YIELD)
            || token.hasValue(Keyword.NEW)
            || token.hasValue(Keyword.THROW);
    }
}
