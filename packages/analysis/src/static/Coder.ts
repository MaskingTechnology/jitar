
import Token from './models/Token';
import { TokenType } from './definitions/TokenType';

const NO_TOKEN = new Token(TokenType.NONE, '', -1, 0);

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
        
        for (let index = 0; index < this.#tokens.length; index++)
        {
            const previous = this.#tokens[index - 1] ?? NO_TOKEN;
            const current = this.#tokens[index];
            const next = this.#tokens[index + 1] ?? NO_TOKEN;
            
            const prefix = this.#needsSpacingBefore(previous, current) ? ' ' : '';
            const postfix = this.#needsSpacingAfter(current, next) ? ' ' : '';

            code += `${prefix}${current.value}${postfix}`;
        }

        return code;
    }

    #needsSpacingBefore(previous: Token, current: Token): boolean
    {
        if (current.isType(TokenType.KEYWORD) && this.#isTextType(previous))
        {
            return true;
        }
        else if (current.isType(TokenType.OPERATOR) && previous.isType(TokenType.OPERATOR))
        {
            return true;
        }
        
        return false;
    }

    #needsSpacingAfter(current: Token, next: Token): boolean
    {
        return current.isType(TokenType.KEYWORD) && (next.isType(TokenType.KEYWORD) || this.#isTextType(next));
    }

    #isTextType(token: Token)
    {
        return token.isType(TokenType.IDENTIFIER)
            || token.isType(TokenType.BOOLEAN)
            || token.isType(TokenType.NOTHING)
            || token.isType(TokenType.NUMBER);
    }
}
