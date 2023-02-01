
import Lexer from './Lexer.js';
import TokenList from './TokenList.js';

import { Array } from './definitions/Array.js';
import { Division } from './definitions/Division.js';
import { Group } from './definitions/Group.js';
import { Keyword, isKeyword } from './definitions/Keyword.js';
import { Operator } from './definitions/Operator.js';
import { Scope } from './definitions/Scope.js';
import { TokenType } from './definitions/TokenType.js';

import ReflectionModule from '../models/ReflectionModule.js';
import ReflectionMember from '../models/ReflectionMember.js';
import ReflectionExport from '../models/ReflectionExport.js';
import ReflectionClass from '../models/ReflectionClass.js';
import ReflectionFunction from '../models/ReflectionFunction.js';
import ReflectionField from '../models/ReflectionField.js';
import ReflectionGetter from '../models/ReflectionGetter.js';
import ReflectionSetter from '../models/ReflectionSetter.js';

// TODO: Add support for parsing anonymous functions
// TODO: Add support for parsing arrow functions
// TODO: Add support for parsing imports

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
                case TokenType.KEYWORD:
                    const parsed = this.#parseKeyword(tokenList);

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
                    // because they are not part of the module
                    tokenList.step();
            }
        }

        return new ReflectionModule(members, exports);
    }

    #parseKeyword(tokenList: TokenList, isAsync = false): ReflectionExport[] | ReflectionMember | undefined
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
                return this.#parseFunction(tokenList, isAsync);

            case Keyword.VAR:
            case Keyword.LET:
            case Keyword.CONST:
                tokenList.step(); // Read away the var/let/const keyword
                return this.#parseField(tokenList, false);

            case Keyword.ASYNC:
                tokenList.step(); // Read away the async keyword
                return this.#parseKeyword(tokenList, true);

            default:
                throw new Error(`Unexpected keyword: ${token.value}`);
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

            case Scope.OPEN:
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
            
            if (token.value === Scope.CLOSE)
            {
                break;
            }

            if (token.value === Division.SEPARATOR)
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
        let isGetter = false;
        let isSetter = false;

        while (tokenList.eof === false)
        {
            const token = tokenList.step();

            if (token.value === Scope.CLOSE)
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

            if (token.value === Keyword.GET)
            {
                isGetter = true;
                continue;
            }

            if (token.value === Keyword.SET)
            {
                isSetter = true;
                continue;
            }

            const nextToken = tokenList.next;

            const member = nextToken.value === Group.OPEN
                ? this.#parseFunction(tokenList, isAsync, isStatic, isGetter, isSetter)
                : this.#parseField(tokenList, isStatic);
            
            isStatic = false;
            isAsync = false;
            isGetter = false;
            isSetter = false;

            members.push(member);
        }
        
        return members;
    }

    #parseFunction(tokenList: TokenList, isAsync: boolean, isStatic = false, isGetter = false, isSetter = false): ReflectionFunction
    {
        const token = tokenList.current;
        const isPrivate = token.value.startsWith('#');
        const name = isPrivate ? token.value.substring(1) : token.value;

        tokenList.step(); // Read away the function name

        const parameters = this.#parseParameters(tokenList);

        tokenList.step(); // Read away the group close
        
        const body = this.#parseBody(tokenList);

        if (isGetter)
        {
            return new ReflectionGetter(name, parameters, body, isStatic, isAsync, isPrivate);
        }

        if (isSetter)
        {
            return new ReflectionSetter(name, parameters, body, isStatic, isAsync, isPrivate);
        }

        return new ReflectionFunction(name, parameters, body, isStatic, isAsync, isPrivate);
    }

    #parseParameters(tokenList: TokenList): ReflectionField[]
    {
        const parameters = [];

        tokenList.step(); // Read away the group open

        while (tokenList.eof === false)
        {
            const token = tokenList.current;

            if (token.value === Group.CLOSE)
            {
                break;
            }

            if (token.value === Division.SEPARATOR)
            {
                tokenList.step(); // Read away the separator

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
            value = this.#parseExpression(tokenList);
        }

        return new ReflectionField(name, value, isStatic, isPrivate);
    }

    #parseExpression(tokenList: TokenList): string
    {
        let code = '';

        while (tokenList.eof === false)
        {
            const token = tokenList.step();

            if (token.value === Division.TERMINATOR)
            {
                return code;
            }

            if (isKeyword(token.value))
            {
                tokenList.stepBack();

                return code;
            }

            code += token.value + ' ';

            switch (token.value)
            {
                case Array.OPEN:
                case Group.OPEN:
                case Scope.OPEN:
                    code += this.#parseExpression(tokenList);
                    break;

                case Array.CLOSE:
                case Group.CLOSE:
                case Scope.CLOSE:
                    return code;
            }
        }
        
        return code;
    }

    #parseBody(tokenList: TokenList): string
    {
        let code = '';

        while (tokenList.eof === false)
        {
            const token = tokenList.step();

            if (token.value === Scope.CLOSE)
            {
                return code;
            }

            code += token.value + ' ';

            if (token.value === Scope.OPEN)
            {
                code += this.#parseBody(tokenList);
            }
        }

        return code;
    }
}
