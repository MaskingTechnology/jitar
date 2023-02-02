
import Lexer from './Lexer.js';
import TokenList from './TokenList.js';

import { Division } from './definitions/Division.js';
import { Group } from './definitions/Group.js';
import { Keyword, isKeyword } from './definitions/Keyword.js';
import { List } from './definitions/List.js';
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
import ReflectionImport from '../models/ReflectionImport.js';
import ReflectionModel from '../models/ReflectionModel.js';

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
        const models = this.#parseTokens(tokenList);

        const imports: ReflectionImport[] = [];
        const members: ReflectionMember[] = [];
        const exports: ReflectionExport[] = [];

        for (const model of models)
        {
            if (model instanceof ReflectionImport)
            {
                imports.push(model);
            }
            else if (model instanceof ReflectionMember)
            {
                members.push(model);
            }
            else if (model instanceof ReflectionExport)
            {
                exports.push(model);
            }
        }

        return new ReflectionModule(imports, members, exports);
    }

    #parseTokens(tokenList: TokenList): ReflectionModel[]
    {
        const models: ReflectionModel[] = [];

        while (tokenList.eof === false)
        {
            const token = tokenList.current;

            switch (token.type)
            {
                case TokenType.KEYWORD:
                    const model = this.#parseKeyword(tokenList);

                    if (model === undefined)
                    {
                        break;
                    }

                    model instanceof Array
                        ? models.push(...model)
                        : models.push(model);
                    
                    break;

                default:
                    // We have no interest in parsing other tokens
                    // because they are not part of the module
                    tokenList.step();
            }
        }

        return models;
    }

    #parseKeyword(tokenList: TokenList, isAsync = false): ReflectionModel[] | ReflectionModel | undefined
    {
        const token = tokenList.current;

        switch (token.value)
        {
            case Keyword.IMPORT:
                tokenList.step(); // Read away the import keyword
                return this.#parseImport(tokenList);
            
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

    #parseImport(tokenList: TokenList): ReflectionImport[] | ReflectionImport
    {
        const token = tokenList.current;

        if (token.hasValue(Scope.OPEN))
        {
            return this.#parseMultiImport(tokenList);
        }

        return this.#parseSingleImport(tokenList);
    }

    /*
     * Supported syntax:
     * - import './somefile.js';
     * - import foo from './somefile.js';
     * - import foo as bar from './somefile.js';
     */
    #parseSingleImport(tokenList: TokenList): ReflectionImport
    {
        let token = tokenList.current;

        const name = token.value;
        let as = name;

        if (tokenList.next.hasValue(Keyword.AS))
        {
            token = tokenList.step(2); // Read away the AS keyword
            as = token.value;
        }

        if (tokenList.next.hasValue(Keyword.FROM))
        {
            token = tokenList.step(2); // Read away the FROM keyword
            const from = token.value;

            return new ReflectionImport(name, as, from);
        }

        // Direct import without grabbing a specific name
        return new ReflectionImport('', '', name);
    }

    /*
     * Supported syntax:
     * - import { foo, bar } from './somefile.js';
     * - import { foo, bar as baz } from './somefile.js';
     */
    #parseMultiImport(tokenList: TokenList): ReflectionImport[]
    {
        const identifiers = [];

        while (tokenList.eof === false)
        {
            let token = tokenList.step();
            
            if (token.hasValue(Scope.CLOSE))
            {
                break;
            }

            if (token.hasValue(Division.SEPARATOR))
            {
                continue;
            }

            const name = token.value;
            let as = name;

            if (tokenList.next.hasValue(Keyword.AS))
            {
                token = tokenList.step(2); // Read away the AS keyword
                as = token.value;
            }

            identifiers.push({ name, as });
        }

        const token = tokenList.step(2); // Read away the FROM keyword
        const from = token.value;

        return identifiers.map(identifier => new ReflectionImport(identifier.name, identifier.as, from));
    }

    #parseExport(tokenList: TokenList): ReflectionExport[] | ReflectionExport
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

    /*
     * Supported syntax:
     * - export const PI = 3.14;
     * - export default function foo() {}
     */
    #parseSingleExport(tokenList: TokenList, isDefault: boolean): ReflectionExport
    {
        let token = tokenList.current;
        let stepSize = 0;

        if (token.hasValue(Keyword.ASYNC))
        {
            token = tokenList.step(); // Read away the async keyword
            stepSize++;
        }

        if (token.hasValue(Keyword.CLASS) || token.hasValue(Keyword.FUNCTION))
        {
            token = tokenList.step(); // Read away the class/function keyword
            stepSize++;
        }

        const name = token.value;
        const as = isDefault ? 'default' : name;

        tokenList.stepBack(stepSize); // Step back to the original position

        return new ReflectionExport(name, as);
    }

    /*
     * Supported syntax:
     * - export { foo, bar };
     * - export { foo, bar as baz };
     */
    #parseMultiExport(tokenList: TokenList): ReflectionExport[]
    {
        const exports = [];

        while (tokenList.eof === false)
        {
            let token = tokenList.step();
            
            if (token.hasValue(Scope.CLOSE))
            {
                break;
            }

            if (token.hasValue(Division.SEPARATOR))
            {
                continue;
            }

            const name = token.value;
            let as = name;

            if (tokenList.next.hasValue(Keyword.AS))
            {
                token = tokenList.step(2); // Read away the AS keyword
                as = token.value;
            }

            exports.push(new ReflectionExport(name, as));
        }

        return exports;
    }

    /*
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/class
     *
     * Supported syntax:
     * - class Person { members }
     * - class Person extends Human { members }
     */
    #parseClass(tokenList: TokenList): ReflectionClass
    {
        let token = tokenList.current;
        const name = token.value;

        tokenList.step(); // Read away the class name

        let parent: string | undefined = undefined;

        if (tokenList.current.hasValue(Keyword.EXTENDS))
        {
            token = tokenList.step(); // Read away the extends keyword
            parent = token.value;

            tokenList.step(); // Read away the extends name
        }
        
        const members = this.#parseMembers(tokenList);

        return new ReflectionClass(name, parent, members);
    }

    /*
     * Supported syntax:
     * - publicField;
     * - #privateField;
     * - static staticField;
     * - constructor() { body }
     * - publicFunction() { body }
     * - #privateFunction() { body }
     * - static staticFunction() { body }
     * - async asyncFunction() { body }
     * - get getter() { body }
     * - set setter(value) { body }
     * - static get staticGetter() { body }
     * - static set staticSetter(value) { body }
     */
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

            if (token.hasValue(Scope.CLOSE))
            {
                break;
            }

            if (token.hasValue(Keyword.STATIC))
            {
                isStatic = true;
                continue;
            }

            if (token.hasValue(Keyword.ASYNC))
            {
                isAsync = true;
                continue;
            }

            if (token.hasValue(Keyword.GET))
            {
                isGetter = true;
                continue;
            }

            if (token.hasValue(Keyword.SET))
            {
                isSetter = true;
                continue;
            }

            const nextToken = tokenList.next;

            const member = nextToken.hasValue(Group.OPEN)
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

            if (token.hasValue(Group.CLOSE))
            {
                break;
            }

            if (token.hasValue(Division.SEPARATOR))
            {
                tokenList.step(); // Read away the separator

                continue;
            }

            const field = this.#parseField(tokenList, false, Division.SEPARATOR);

            parameters.push(field);
        }

        return parameters;
    }

    #parseField(tokenList: TokenList, isStatic: boolean, terminator = Division.TERMINATOR): ReflectionField
    {
        let token = tokenList.current;

        const isPrivate = token.value.startsWith('#');
        const name = isPrivate ? token.value.substring(1) : token.value;

        token = tokenList.step(); // Read away the field name

        let value = undefined;

        if (token.hasValue(Operator.ASSIGN))
        {
            value = this.#parseExpression(tokenList, terminator);
        }

        return new ReflectionField(name, value, isStatic, isPrivate);
    }

    #parseExpression(tokenList: TokenList, terminator: string): string
    {
        let token = tokenList.step();
        let code = '';

        while (tokenList.eof === false)
        {
            if (token.value === terminator)
            {
                return code;
            }

            if (isKeyword(token.value))
            {
                tokenList.stepBack();

                return code;
            }

            code += token.toString();

            switch (token.value)
            {
                case List.OPEN:
                case Group.OPEN:
                case Scope.OPEN:
                    code += this.#parseExpression(tokenList, Division.TERMINATOR);
                    break;

                case List.CLOSE:
                case Group.CLOSE:
                case Scope.CLOSE:
                    return code;
            }

            token = tokenList.step();
        }
        
        return code;
    }

    #parseBody(tokenList: TokenList): string
    {
        let token = tokenList.step();
        let code = '';

        while (tokenList.eof === false)
        {
            if (token === undefined)
            {
                return code;
            }

            if (token.hasValue(Scope.CLOSE))
            {
                return code;
            }

            code += token.toString();

            if (token.hasValue(Scope.OPEN))
            {
                code += this.#parseBody(tokenList);
            }

            token = tokenList.step();
        }

        return code;
    }
}
