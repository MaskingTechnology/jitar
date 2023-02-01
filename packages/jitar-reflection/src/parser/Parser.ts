
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

    #parseIdentifier(tokenList: TokenList, isAsync = false): ReflectionExport[] | ReflectionMember | undefined
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
                return this.#parseFunction(tokenList, false, isAsync);

            case Keyword.VAR:
            case Keyword.LET:
            case Keyword.CONST:
                tokenList.step(); // Read away the var/let/const keyword
                return this.#parseField(tokenList, false);

            case Keyword.ASYNC:
                tokenList.step(); // Read away the async keyword
                return this.#parseIdentifier(tokenList, true);

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
        let stepSize = 0;

        if (token.value === Keyword.ASYNC)
        {
            token = tokenList.step(); // Read away the async keyword
            stepSize++;
        }

        if (token.value === Keyword.CLASS || token.value === Keyword.FUNCTION)
        {
            token = tokenList.step(); // Read away the class/function keyword
            stepSize++;
        }

        const name = token.value;
        const as = isDefault ? 'default' : name;

        tokenList.stepBack(stepSize); // Step back to the original position

        return [new ReflectionExport(name, as)];
    }

    #parseMultiExport(tokenList: TokenList): ReflectionExport[]
    {
        const exports = [];

        while (tokenList.eof === false)
        {
            let token = tokenList.step();
            
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
                token = tokenList.step(2); // Read away the AS keyword and use the alternative name
                as = token.value;
            }

            exports.push(new ReflectionExport(name, as));
        }

        return exports;
    }

    #parseClass(tokenList: TokenList): ReflectionClass
    {
        let token = tokenList.current;
        const name = token.value;

        tokenList.step(); // Read away the class name

        let parent: string | undefined = undefined;

        if (tokenList.current.value === Keyword.EXTENDS)
        {
            token = tokenList.step(); // Read away the extends keyword
            parent = token.value;

            tokenList.step(); // Read away the extends name
        }
        
        const members = this.#parseMembers(tokenList);

        return new ReflectionClass(name, parent, members);
    }

    #parseMembers(tokenList: TokenList): ReflectionMember[]
    {
        const members = [];

        let isAsync = false;
        let isStatic = false;

        while (tokenList.eof === false)
        {
            const token = tokenList.step();

            if (token.value === Punctuation.RIGHT_BRACE)
            {
                break;
            }

            if (token.value === Keyword.STATIC)
            {
                isStatic = true;
                continue;
            }

            if (token.value === Keyword.ASYNC)
            {
                isAsync = true;
                continue;
            }

            const nextToken = tokenList.next;

            const member = nextToken.value === Punctuation.LEFT_PARENTHESIS
                ? this.#parseFunction(tokenList, isStatic, isAsync)
                : this.#parseField(tokenList, isStatic);
            
            isStatic = false;
            isAsync = false;

            members.push(member);
        }
        
        return members;
    }

    #parseFunction(tokenList: TokenList, isStatic: boolean, isAsync: boolean): ReflectionFunction
    {
        const token = tokenList.current;
        const isPrivate = token.value.startsWith('#');
        const name = isPrivate ? token.value.substring(1) : token.value;

        tokenList.step(); // Read away the function name

        const parameters = this.#parseParameters(tokenList);

        tokenList.step(); // Read away the right parenthesis
        
        const body = this.#parseBody(tokenList);

        return new ReflectionFunction(name, parameters, body, isStatic, isAsync, isPrivate);
    }

    #parseParameters(tokenList: TokenList): ReflectionField[]
    {
        const parameters = [];

        tokenList.step(); // Read away the left parenthesis

        while (tokenList.eof === false)
        {
            const token = tokenList.current;

            if (token.value === Punctuation.RIGHT_PARENTHESIS)
            {
                break;
            }

            if (token.value === Punctuation.COMMA)
            {
                tokenList.step(); // Read away the comma

                continue;
            }

            const field = this.#parseField(tokenList, false);

            parameters.push(field);
        }

        return parameters;
    }

    #parseField(tokenList: TokenList, isStatic: boolean): ReflectionField
    {
        let token = tokenList.current;

        const isPrivate = token.value.startsWith('#');
        const name = isPrivate ? token.value.substring(1) : token.value;

        token = tokenList.step(); // Read away the field name

        let value = undefined;

        if (token.value === Operator.ASSIGN)
        {
            token = tokenList.step(); // Read away the assign operator
            value = this.#parseExpression(tokenList);
        }

        return new ReflectionField(name, value, isStatic, isPrivate);
    }

    #parseExpression(tokenList: TokenList): string
    {
        const token = tokenList.step(); // Read away the value

        return token.value;
    }

    #parseBody(tokenList: TokenList): string
    {
        let code = '';

        while (tokenList.eof === false)
        {
            const token = tokenList.step();

            code += token.value + ' ';

            switch (token.value)
            {
                case Punctuation.LEFT_BRACE:
                    code += this.#parseBody(tokenList);
                    break;

                case Punctuation.RIGHT_BRACE:
                    return code;
            }
        }

        return code;
    }
}
