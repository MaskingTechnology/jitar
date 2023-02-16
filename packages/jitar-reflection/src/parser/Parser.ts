
import Lexer from './Lexer.js';
import TokenList from './TokenList.js';

import { Division } from './definitions/Division.js';
import { Group } from './definitions/Group.js';
import { Keyword, isKeyword, isDeclaration } from './definitions/Keyword.js';
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
import ReflectionGenerator from '../models/ReflectionGenerator.js';
import ReflectionExpression from '../models/ReflectionExpression.js';
import ReflectionArray from '../models/ReflectionArray.js';
import ReflectionObject from '../models/ReflectionObject.js';
import ReflectionAlias from '../models/ReflectionAlias.js';
import Token from './Token.js';
import ReflectionScope from '../models/ReflectionScope.js';
import ReflectionValue from '../models/ReflectionValue.js';
import ReflectionParameter from '../models/ReflectionParameter.js';

const ANONYMOUS = '(anonymous)';

export default class Parser
{
    #lexer: Lexer;

    constructor()
    {
        this.#lexer = new Lexer();
    }

    parseModule(code: string): ReflectionModule
    {
        const tokenList = this.#lexer.tokenize(code);
        const scope = this.#parseScope(tokenList);

        return new ReflectionModule(scope);
    }

    parseClass(code: string): ReflectionClass
    {
        const tokenList = this.#lexer.tokenize(code);
        const model = this.#parseKeyword(tokenList);

        if ((model instanceof ReflectionClass) === false)
        {
            throw new Error('The given code does not contain a class definition');
        }

        return model as ReflectionClass;
    }

    parseFunction(code: string): ReflectionFunction
    {
        const tokenList = this.#lexer.tokenize(code);
        const model = this.#parseKeyword(tokenList);

        if ((model instanceof ReflectionFunction) === false)
        {
            throw new Error('The given code does not contain a function definition');
        }

        return model as ReflectionFunction;
    }

    parseField(code: string): ReflectionField
    {
        const tokenList = this.#lexer.tokenize(code);
        const model = this.#parseKeyword(tokenList);

        if ((model instanceof ReflectionField) === false)
        {
            throw new Error('The given code does not contain a field definition');
        }

        return model as ReflectionField;
    }

    #parseScope(tokenList: TokenList): ReflectionScope
    {
        const members: ReflectionMember[] = [];

        while (tokenList.eof === false)
        {
            const member = this.#parseNext(tokenList);

            if (member instanceof ReflectionMember)
            {
                members.push(member);
            }
        }

        return new ReflectionScope(members);
    }

    #parseNext(tokenList: TokenList, isAsync = false): ReflectionMember | ReflectionValue
    {
        const token = tokenList.current;

        if (token.isType(TokenType.IDENTIFIER) || token.isType(TokenType.LITERAL) || token.hasValue(Keyword.NEW))
        {
            return this.#parseExpression(tokenList);
        }
        else if (token.isType(TokenType.KEYWORD))
        {
            if (token.hasValue(Keyword.ASYNC))
            {
                tokenList.step(); // Read away the async keyword

                return this.#parseNext(tokenList, true);
            }

            return this.#parseKeyword(tokenList, isAsync);
        }
        else if (token.hasValue(Group.OPEN))
        {
            return this.#parseArrowFunction(tokenList, isAsync);
        }
        else if (token.hasValue(Scope.OPEN))
        {
            return this.#parseObject(tokenList);
        }
        else if (token.hasValue(List.OPEN))
        {
            return this.#parseArray(tokenList);
        }

        throw new Error(`Unexpected token ${token.value}`);
    }

    #parseKeyword(tokenList: TokenList, isAsync = false): ReflectionMember
    {
        const token = tokenList.current;

        tokenList.step(); // Read away the keyword

        switch (token.value)
        {
            case Keyword.IMPORT:
                return this.#parseImport(tokenList);
            
            case Keyword.EXPORT:
                return this.#parseExport(tokenList);
            
            case Keyword.CLASS:
                return this.#parseClass(tokenList);

            case Keyword.FUNCTION:
                return this.#parseFunction(tokenList, isAsync);

            case Keyword.VAR:
            case Keyword.LET:
            case Keyword.CONST:
                return this.#parseDeclaration(tokenList, false);

            case Keyword.ASYNC:
                return this.#parseKeyword(tokenList, true);

            default:
                throw new Error(`Unexpected keyword: ${token.value}`);
        }
    }

    #parseImport(tokenList: TokenList): ReflectionImport
    {
        const members: ReflectionAlias[] = [];

        let token = tokenList.current;
        
        if (token.isType(TokenType.LITERAL))
        {
            return new ReflectionImport(members, token.value);
        }

        if (token.hasValue(Scope.OPEN) === false)
        {
            const name = 'default';
            let as = token.value;

            token = tokenList.step(); // Read away the name

            if (token.hasValue(Keyword.AS))
            {
                token = tokenList.step(); // Read away the AS keyword
                as = token.value;

                token = tokenList.step(); // Read away the alias name
            }

            members.push(new ReflectionAlias(name, as));
        }

        if (token.hasValue(Division.SEPARATOR))
        {
            token = tokenList.step(); // Read away the separator
        }

        if (token.hasValue(Scope.OPEN))
        {
            const aliases = this.#parseAliasList(tokenList);

            members.push(...aliases);

            token = tokenList.current;
        }

        if (token.hasValue(Keyword.FROM) === false)
        {
            throw new Error('Expected the FROM keyword');
        }

        token = tokenList.step(); // Read away the FROM keyword
        const from = token.value;

        return new ReflectionImport(members, from);
    }

    #parseExport(tokenList: TokenList): ReflectionExport
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

    #parseSingleExport(tokenList: TokenList, isDefault: boolean): ReflectionExport
    {
        let token = tokenList.current;
        let stepSize = 0;

        if (token.hasValue(Keyword.ASYNC))
        {
            token = tokenList.step(); // Read away the async keyword
            stepSize++;
        }

        if (isDeclaration(token.value))
        {
            token = tokenList.step(); // Read away the declaration keyword
            stepSize++;
        }

        const name = token.isType(TokenType.IDENTIFIER) ? token.value : ANONYMOUS;
        const as = isDefault ? 'default' : name;
        let from: string | undefined = undefined;

        token = tokenList.step(); // Read away the name

        if (token?.hasValue(Keyword.FROM))
        {
            token = tokenList.step(); // Read away the FROM keyword
            
            from = token.value;
        }

        if (stepSize > 0)
        {
            stepSize++; // Include the name when stepping back

            tokenList.stepBack(stepSize); // Step back to the original position
        }

        const alias = new ReflectionAlias(name, as);

        return new ReflectionExport([alias], from);
    }

    #parseMultiExport(tokenList: TokenList): ReflectionExport
    {
        const members = this.#parseAliasList(tokenList);
        let from: string | undefined = undefined;
        let token = tokenList.current;

        if (token !== undefined && token.hasValue(Keyword.FROM))
        {
            token = tokenList.step(); // Read away the FROM keyword
            from = token.value;
        }

        return new ReflectionExport(members, from);
    }

    // { ... }
    #parseAliasList(tokenList: TokenList): ReflectionAlias[]
    {
        const aliases = [];

        let token = tokenList.step(); // Read away the scope open

        while (tokenList.eof === false)
        {
            if (token.hasValue(Scope.CLOSE))
            {
                tokenList.step(); // Read away the scope close

                break;
            }

            if (token.hasValue(Division.SEPARATOR))
            {
                token = tokenList.step(); // Read away the separator

                continue;
            }

            const alias = this.#parseAlias(tokenList);

            aliases.push(alias);

            token = tokenList.step();
        }

        return aliases;
    }

    #parseAlias(tokenList: TokenList): ReflectionAlias
    {
        let token = tokenList.current;

        const name = token.value;
        let as = name;

        if (tokenList.next.hasValue(Keyword.AS))
        {
            token = tokenList.step(2); // Read away the AS keyword
            as = token.value;
        }

        return new ReflectionAlias(name, as);
    }

    #parseDeclaration(tokenList: TokenList, isStatic: boolean): ReflectionMember
    {
        let token = tokenList.current;

        const isPrivate = token.value.startsWith('#');
        const name = isPrivate ? token.value.substring(1) : token.value;

        token = tokenList.step(); // Read away the field name

        let value = undefined;

        if (token.hasValue(Division.TERMINATOR))
        {
            tokenList.step(); // Read away the terminator
        }
        else if (token.hasValue(Operator.ASSIGN))
        {
            token = tokenList.step(); // Read away the assignment operator
            value = this.#parseNext(tokenList, false)
        }

        if (value instanceof ReflectionFunction)
        {
            return new ReflectionFunction(name, value.parameters, value.body, isStatic, value.isAsync, isPrivate);
        }

        if (value instanceof ReflectionClass)
        {
            return new ReflectionClass(name, value.parentName, value.scope);
        }
        
        return new ReflectionField(name, value as ReflectionValue, isStatic, isPrivate);
    }

    #parseFunction(tokenList: TokenList, isAsync: boolean, isStatic = false, isGetter = false, isSetter = false): ReflectionFunction
    {
        let token = tokenList.current;
        let name = ANONYMOUS;
        let isGenerator = false;
        let isPrivate = false;

        if (token.hasValue(Operator.MULTIPLY))
        {
            isGenerator = true;

            token = tokenList.step(); // Read away the generator operator
        }

        if (token.isType(TokenType.IDENTIFIER))
        {
            isPrivate = token.value.startsWith('#');
            name = isPrivate ? token.value.substring(1) : token.value;

            token = tokenList.step(); // Read away the function name
        }
        
        const parameters = this.#parseParameters(tokenList);

        token = tokenList.current;

        if (token.hasValue(Scope.OPEN) === false)
        {
            throw new Error('Invalid function body');
        }
        
        const body = this.#parseBlock(tokenList, Scope.OPEN, Scope.CLOSE);

        if (isGenerator)
        {
            return new ReflectionGenerator(name, parameters, body, isStatic, isAsync, isPrivate);
        }

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

    #parseArrowFunction(tokenList: TokenList, isAsync: boolean): ReflectionFunction
    {
        const parameters = this.#parseParameters(tokenList);

        let token = tokenList.current;

        if (token.hasValue('=>') === false)
        {
            throw new Error('Invalid arrow function');
        }

        token = tokenList.step(); // Read away the arrow
        
        const body = token.hasValue(Scope.OPEN)
            ? this.#parseBlock(tokenList, Scope.OPEN, Scope.CLOSE)
            : this.#parseExpression(tokenList).definition;

        return new ReflectionFunction(ANONYMOUS, parameters, body, false, isAsync, false);
    }

    // ( ... )
    #parseParameters(tokenList: TokenList): ReflectionParameter[]
    {
        const parameters = [];

        tokenList.step(); // Read away the group open

        while (tokenList.eof === false)
        {
            const token = tokenList.current;

            if (token.hasValue(Group.CLOSE))
            {
                // No parameters

                tokenList.step(); // Read away the group close

                break;
            }
            else if (tokenList.previous.hasValue(Group.CLOSE))
            {
                // End of the parameters

                break;
            }

            if (token.hasValue(Division.SEPARATOR))
            {
                tokenList.step(); // Read away the separator

                continue;
            }

            let parameter;

            if (token.hasValue(Scope.OPEN))
            {
                parameter = this.#parseObject(tokenList);
            }
            else if (token.hasValue(List.OPEN))
            {
                parameter = this.#parseArray(tokenList);
            }
            else
            {
                parameter = this.#parseDeclaration(tokenList, false) as ReflectionField;
            }

            parameters.push(parameter);
        }

        return parameters;
    }

    #parseClass(tokenList: TokenList): ReflectionClass
    {
        let token = tokenList.current;
        let name = ANONYMOUS;
        let parent: string | undefined = undefined;

        if (token.isType(TokenType.IDENTIFIER))
        {
            name = token.value;

            tokenList.step(); // Read away the class name
        }

        if (tokenList.current.hasValue(Keyword.EXTENDS))
        {
            token = tokenList.step(); // Read away the extends keyword
            parent = token.value;

            tokenList.step(); // Read away the extends name
        }
        
        const scope = this.#parseClassScope(tokenList);

        return new ReflectionClass(name, parent, scope);
    }

    #parseClassScope(tokenList: TokenList): ReflectionScope
    {
        let token = tokenList.step();
        const members = [];

        while (tokenList.eof === false)
        {
            if (token.hasValue(Scope.CLOSE))
            {
                tokenList.step(); // Read away the scope close

                break;
            }

            const member = this.#parseClassMember(tokenList);

            members.push(member);

            token = tokenList.current;
        }
        
        return new ReflectionScope(members);
    }

    #parseClassMember(tokenList: TokenList): ReflectionMember
    {
        let token = tokenList.current;

        let isAsync = false;
        let isStatic = false;
        let isGetter = false;
        let isSetter = false;

        while (tokenList.eof === false)
        {
            if (token.hasValue(Keyword.STATIC))
            {
                isStatic = true;
            }
            else if (token.hasValue(Keyword.ASYNC))
            {
                isAsync = true;
            }
            else if (token.hasValue(Keyword.GET))
            {
                isGetter = true;
            }
            else if (token.hasValue(Keyword.SET))
            {
                isSetter = true;
            }
            else
            {
                break;
            }

            token = tokenList.step();
        }

        const nextToken = tokenList.next;

        return nextToken.hasValue(Group.OPEN)
            ? this.#parseFunction(tokenList, isAsync, isStatic, isGetter, isSetter)
            : this.#parseDeclaration(tokenList, isStatic);
    }

    #parseArray(tokenList: TokenList): ReflectionArray
    {
        const items = this.#parseBlock(tokenList, List.OPEN, List.CLOSE);

        return new ReflectionArray(items);
    }

    #parseObject(tokenList: TokenList): ReflectionObject
    {
        const fields = this.#parseBlock(tokenList, Scope.OPEN, Scope.CLOSE);

        return new ReflectionObject(fields);
    }

    #opensContainer(token: Token): boolean
    {
        return [List.OPEN, Group.OPEN, Scope.OPEN].includes(token.value);
    }

    #closesContainer(token: Token): boolean
    {
        return [List.CLOSE, Group.CLOSE, Scope.CLOSE].includes(token.value);
    }

    #atEndOfStatement(token: Token): boolean
    {
        return [Division.SEPARATOR, Division.TERMINATOR].includes(token.value)
            || this.#closesContainer(token);
    }

    #parseExpression(tokenList: TokenList): ReflectionExpression
    {
        let token = tokenList.current;
        let code = '';

        while (tokenList.eof === false)
        {
            if (this.#opensContainer(token))
            {
                code += token.toString() + ' ';

                tokenList.step(); // Read away the container open

                const expression = this.#parseExpression(tokenList);

                code += expression.definition + ' ';
            }
            else if (this.#atEndOfStatement(token))
            {
                if (this.#closesContainer(token))
                {
                    code += token.toString();
                }
                else if (token.hasValue(Division.TERMINATOR))
                {
                    tokenList.step(); // Read away the terminator
                }
                
                break;
            }
            else
            {
                code += token.toString() + ' ';
            }

            token = tokenList.step();
        }

        return new ReflectionExpression(code.trim());
    }

    #parseBlock(tokenList: TokenList, openId: string, closeId: string): string
    {
        let token = tokenList.step();
        let code = openId + ' ';

        while (tokenList.eof === false)
        {
            if (token === undefined)
            {
                return code.trim();
            }

            code += token.hasValue(openId)
                ? this.#parseBlock(tokenList, openId, closeId) + ' ' + closeId + ' '
                : token.toString() + ' ';
            
            if (token.hasValue(closeId))
            {
                tokenList.step(); // Read away the close

                return code.trim();
            }

            token = tokenList.step();
        }

        return code.trim();
    }
}
