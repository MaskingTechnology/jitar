
import Keyword from './definitions/Keyword.js';
import Punctuation from './definitions/Punctuation.js';
import Lexer from './Lexer.js';
import TokenList from './TokenList.js';
import TokenType from './definitions/TokenType.js';
import Operator from './definitions/Operator.js';

type Item = { type: 'field' | 'function' | 'class', name: string };
type Field = Item & { value?: string };
type Function = Item & { parameters: Field[] };
type Class = Item & { parent?: string, members: Member[] };
type Member = Field | Function | Class;
type Export = { name: string, as: string };
type Module = { exports: Export[], members: Member[] };

export default class Parser
{
    #lexer: Lexer;

    constructor()
    {
        this.#lexer = new Lexer();
    }

    parse(code: string)
    {
        const tokenList = this.#lexer.tokenize(code);
        const module = { exports: [], members: [] }

        while (tokenList.eof === false)
        {
            const token = tokenList.current;

            switch (token.type)
            {
                case TokenType.IDENTIFIER:
                    this.#parseIdentifier(tokenList, module);
                    break;

                default:
                    // We have no interest in parsing other tokens
                    tokenList.step();
            }
        }

        return module;
    }

    #parseIdentifier(tokenList: TokenList, module: Module): void
    {
        const token = tokenList.current;

        switch (token.value)
        {
            case Keyword.EXPORT:
                tokenList.step(); // Read away the export keyword
                const exported = this.#parseExport(tokenList);
                module.exports.push(...exported);
                break;
            
            case Keyword.CLASS:
                tokenList.step(); // Read away the class keyword
                const clazz = this.#parseClass(tokenList);
                module.members.push(clazz);
                break;

            case Keyword.FUNCTION:
                tokenList.step(); // Read away the function keyword
                const funktion = this.#parseFunction(tokenList);
                module.members.push(funktion);
                break;

            case Keyword.VAR:
            case Keyword.LET:
            case Keyword.CONST:
                tokenList.step(); // Read away the var/let/const keyword
                const field = this.#parseField(tokenList);
                module.members.push(field);
                break;

            default:
                // We have no interest in parsing other literals
                tokenList.step();
        }
    }

    #parseExport(tokenList: TokenList): Export[]
    {
        const token = tokenList.current;

        switch (token.value)
        {
            case Keyword.DEFAULT:
                tokenList.step(); // Read away the default keyword
                return this.#parseSingleExport(tokenList, true);

            case Punctuation.LEFT_BRACE:
                return this.#parseMultiExport(tokenList);

            default:
                return this.#parseSingleExport(tokenList, false);
        }
    }

    #parseSingleExport(tokenList: TokenList, isDefault: boolean): Export[]
    {
        let token = tokenList.current;

        if (token.value === Keyword.ASYNC)
        {
            tokenList.step(); // Read away the async keyword

            token = tokenList.current;
        }

        if (token.value === Keyword.CLASS || token.value === Keyword.FUNCTION)
        {
            token = tokenList.next;
        }

        const name = token.value;
        const as = isDefault ? 'default' : name;

        return [{ name, as }];
    }

    #parseMultiExport(tokenList: TokenList): Export[]
    {
        const exports: Export[] = [];

        while (tokenList.eof === false)
        {
            tokenList.step();

            const token = tokenList.current;
            
            if (token.value === Punctuation.RIGHT_BRACE)
            {
                break;
            }

            if (token.value === Punctuation.COMMA)
            {
                continue;
            }

            const name = token.value;
            let as = name;

            if (tokenList.next.value === Keyword.AS)
            {
                // Read away the AS keyword and use the alternative name

                tokenList.step(2);

                as = tokenList.current.value;
            }

            exports.push({ name, as });
        }

        return exports;
    }

    #parseClass(tokenList: TokenList): Class
    {
        const name = tokenList.current.value;

        tokenList.step(); // Read away the class name

        let parent: string | undefined = undefined;

        if (tokenList.current.value === Keyword.EXTENDS)
        {
            tokenList.step(); // Read away the extends keyword

            parent = tokenList.current.value;

            tokenList.step(); // Read away the extends name
        }
        
        const members = this.#parseMembers(tokenList);

        return { type: 'class', name, parent, members };
    }

    #parseMembers(tokenList: TokenList): Member[]
    {
        const members = [];

        while (tokenList.eof === false)
        {
            tokenList.step();

            const token = tokenList.current;

            if (token.value === Punctuation.RIGHT_BRACE)
            {
                break;
            }

            if (token.value === Keyword.STATIC || token.value === Keyword.ASYNC)
            {
                continue;
            }

            const nextToken = tokenList.next;

            const member = nextToken.value === Punctuation.LEFT_PARENTHESIS
                ? this.#parseFunction(tokenList)
                : this.#parseField(tokenList);
            
            members.push(member);
        }
        
        return members;
    }

    #parseFunction(tokenList: TokenList): Function
    {
        const name = tokenList.current.value;

        tokenList.step(); // Read away the function name

        const parameters = this.#parseParameters(tokenList);

        tokenList.step(); // Read away the right parenthesis
        
        this.#skipScope(tokenList); // Read away the function body

        return { type: 'function', name, parameters };
    }

    #parseParameters(tokenList: TokenList): Field[]
    {
        const parameters = [];

        tokenList.step(); // Read away the left parenthesis

        while (tokenList.eof === false)
        {
            let token = tokenList.current;

            if (token.value === Punctuation.RIGHT_PARENTHESIS)
            {
                break;
            }

            if (token.value === Punctuation.COMMA)
            {
                tokenList.step(); // Read away the comma

                continue;
            }

            const field = this.#parseField(tokenList);

            parameters.push(field);
        }

        return parameters;
    }

    #parseField(tokenList: TokenList): Field
    {
        let token = tokenList.current;

        const name = token.value;

        tokenList.step(); // Read away the field name

        let value = undefined;

        if (tokenList.current.value === Operator.ASSIGN)
        {
            tokenList.step(); // Read away the default value

            token = tokenList.current;
            value = token.type === TokenType.LITERAL
                ? `"${token.value}"`
                : token.value;
        }

        return { type: 'field', name, value };
    }

    #skipScope(tokenList: TokenList): void
    {
        while (tokenList.eof === false)
        {
            tokenList.step();

            const token = tokenList.current;

            switch (token.value)
            {
                case Punctuation.LEFT_BRACE:
                    this.#skipScope(tokenList);
                    break;

                case Punctuation.RIGHT_BRACE:
                    return;
            }
        }
    }
}
