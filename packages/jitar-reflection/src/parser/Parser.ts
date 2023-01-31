
import Lexer from './Lexer.js';
import TokenList from './TokenList.js';

import Keyword from './definitions/Keyword.js';
import Punctuation from './definitions/Punctuation.js';
import TokenType from './definitions/TokenType.js';
import Operator from './definitions/Operator.js';

import ReflectionModule from '../models/ReflectionModule.js';
import ReflectionMember from '../models/ReflectionMember.js';
import ReflectionExport from '../models/ReflectionExport.js';
import ReflectionClass from '../models/ReflectionClass.js';
import ReflectionFunction from '../models/ReflectionFunction.js';
import ReflectionField from '../models/ReflectionField.js';

export default class Parser
{
    #lexer: Lexer;

    constructor()
    {
        this.#lexer = new Lexer();
    }

    parse(code: string): ReflectionModule
    {
        const tokenList = this.#lexer.tokenize(code);
        const members: ReflectionMember[] = [];
        const exports: ReflectionExport[] = [];

        while (tokenList.eof === false)
        {
            const token = tokenList.current;

            switch (token.type)
            {
                case TokenType.IDENTIFIER:
                    const parsed = this.#parseIdentifier(tokenList);

                    if (parsed === undefined)
                    {
                        break;
                    }

                    parsed instanceof ReflectionMember
                        ? members.push(parsed)
                        : exports.push(...parsed);
                    
                    break;

                default:
                    // We have no interest in parsing other tokens
                    tokenList.step();
            }
        }

        return new ReflectionModule(members, exports);
    }

    #parseIdentifier(tokenList: TokenList): ReflectionExport[] | ReflectionMember | undefined
    {
        const token = tokenList.current;

        switch (token.value)
        {
            case Keyword.EXPORT:
                tokenList.step(); // Read away the export keyword
                return this.#parseExport(tokenList);
            
            case Keyword.CLASS:
                tokenList.step(); // Read away the class keyword
                return this.#parseClass(tokenList);

            case Keyword.FUNCTION:
                tokenList.step(); // Read away the function keyword
                return this.#parseFunction(tokenList);

            case Keyword.VAR:
            case Keyword.LET:
            case Keyword.CONST:
                tokenList.step(); // Read away the var/let/const keyword
                return this.#parseField(tokenList);

            default:
                // We have no interest in parsing other literals
                tokenList.step();
        }
    }

    #parseExport(tokenList: TokenList): ReflectionExport[]
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

    #parseSingleExport(tokenList: TokenList, isDefault: boolean): ReflectionExport[]
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

        return [new ReflectionExport(name, as)];
    }

    #parseMultiExport(tokenList: TokenList): ReflectionExport[]
    {
        const exports = [];

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

            exports.push(new ReflectionExport(name, as));
        }

        return exports;
    }

    #parseClass(tokenList: TokenList): ReflectionClass
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

        return new ReflectionClass(name, parent, members);
    }

    #parseMembers(tokenList: TokenList): ReflectionMember[]
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

    #parseFunction(tokenList: TokenList): ReflectionFunction
    {
        const name = tokenList.current.value;

        tokenList.step(); // Read away the function name

        const parameters = this.#parseParameters(tokenList);

        tokenList.step(); // Read away the right parenthesis
        
        this.#skipScope(tokenList); // Read away the function body

        return new ReflectionFunction(name, parameters);
    }

    #parseParameters(tokenList: TokenList): ReflectionField[]
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

    #parseField(tokenList: TokenList): ReflectionField
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

        return new ReflectionField(name, value);
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
