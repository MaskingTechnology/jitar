
import Lexer from './Lexer.js';
import Token from './Token.js';
import TokenList from './TokenList.js';

import { Divider, isDivider } from './definitions/Divider.js';
import { Group } from './definitions/Group.js';
import { Keyword, isDeclaration, isKeyword, isNotReserved } from './definitions/Keyword.js';
import { List } from './definitions/List.js';
import { Operator } from './definitions/Operator.js';
import { Scope } from './definitions/Scope.js';
import { TokenType } from './definitions/TokenType.js';

import ExpectedKeyword from './errors/ExpectedKeyword.js';
import ExpectedToken from './errors/ExpectedToken.js';
import UnexpectedKeyword from './errors/UnexpectedKeyword.js';
import UnexpectedParseResult from './errors/UnexpectedParseResult.js';
import UnexpectedToken from './errors/UnexpectedToken.js';

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
import ReflectionScope from '../models/ReflectionScope.js';
import ReflectionValue from '../models/ReflectionValue.js';
import ReflectionParameter from '../models/ReflectionParameter.js';
import ReflectionDestructuredArray from '../models/ReflectionDestructuredArray.js';
import ReflectionDestructuredObject from '../models/ReflectionDestructuredObject.js';
import ReflectionDeclaration from '../models/ReflectionDeclaration.js';
import ReflectionIdentifier from '../models/ReflectionIdentifier.js';

const ANONYMOUS_IDENTIFIER = '';
const DEFAULT_IDENTIFIER = 'default';
const PRIVATE_INDICATOR = '#';
const DEFINITION_SEPARATOR = ' ';

export default class Parser
{
    #lexer: Lexer;

    constructor(lexer = new Lexer())
    {
        this.#lexer = lexer;
    }

    parse(code: string): ReflectionModule
    {
        const tokenList = this.#lexer.tokenize(code);
        const scope = this.#parseScope(tokenList);

        return new ReflectionModule(scope);
    }

    parseFirst(code: string): ReflectionMember | ReflectionValue | undefined
    {
        const tokenList = this.#lexer.tokenize(code);

        return this.#parseNext(tokenList);
    }

    parseValue(code: string): ReflectionValue
    {
        const model = this.parseFirst(code);

        if ((model instanceof ReflectionValue) === false)
        {
            throw new UnexpectedParseResult('a value definition');
        }

        return model as ReflectionValue;
    }

    parseImport(code: string): ReflectionImport
    {
        const model = this.parseFirst(code);

        if ((model instanceof ReflectionImport) === false)
        {
            throw new UnexpectedParseResult('an import definition');
        }

        return model;
    }

    parseExport(code: string): ReflectionExport
    {
        const model = this.parseFirst(code);

        if ((model instanceof ReflectionExport) === false)
        {
            throw new UnexpectedParseResult('an export definition');
        }

        return model;
    }

    parseDeclaration(code: string): ReflectionDeclaration
    {
        const model = this.parseFirst(code);

        if ((model instanceof ReflectionDeclaration) === false)
        {
            throw new UnexpectedParseResult('a declaration definition');
        }

        return model;
    }

    parseFunction(code: string): ReflectionFunction
    {
        const tokenList = this.#lexer.tokenize(code);
        const model = this.#parseMember(tokenList);

        if ((model instanceof ReflectionFunction) === false)
        {
            throw new UnexpectedParseResult('a function definition');
        }

        return model;
    }

    parseClass(code: string): ReflectionClass
    {
        const tokenList = this.#lexer.tokenize(code);
        const model = this.#parseMember(tokenList);

        if ((model instanceof ReflectionClass) === false)
        {
            throw new UnexpectedParseResult('a class definition');
        }

        return model;
    }

    #parseScope(tokenList: TokenList): ReflectionScope
    {
        const members: ReflectionMember[] = [];

        while (tokenList.notAtEnd())
        {
            const member = this.#parseNext(tokenList);

            if (member instanceof ReflectionMember)
            {
                // Only reflection members are of interest
                // because they can be exported

                members.push(member);
            }
        }

        return new ReflectionScope(members);
    }

    // eslint-disable-next-line sonarjs/cognitive-complexity
    #parseNext(tokenList: TokenList, isAsync = false): ReflectionMember | ReflectionValue | undefined
    {
        const token = tokenList.current;

        if (token.isType(TokenType.LITERAL))
        {
            return this.#parseExpression(tokenList);
        }
        else if (token.isType(TokenType.IDENTIFIER))
        {
            const next = tokenList.next;

            if (next?.hasValue(Operator.ARROW))
            {
                return this.#parseArrowFunction(tokenList, isAsync);
            }

            return this.#parseExpression(tokenList);
        }
        else if (token.isType(TokenType.KEYWORD))
        {
            if (isNotReserved(token.value))
            {
                const next = tokenList.next;
                const nextIsFunction = next !== undefined && (next.hasValue(Keyword.FUNCTION) || next.hasValue(Group.OPEN));
                
                if (token.hasValue(Keyword.ASYNC) && nextIsFunction)
                {
                    tokenList.step(); // Read away the async keyword

                    return this.#parseNext(tokenList, true);
                }
                else if (next === undefined || this.#atEndOfStatement(next))
                {
                    return this.#parseExpression(tokenList);
                }
            }
            
            if (token.hasValue(Keyword.RETURN))
            {
                return this.#parseExpression(tokenList);
            }

            return this.#parseMember(tokenList, isAsync);
        }
        else if (token.isType(TokenType.REGEX))
        {
            return this.#parseExpression(tokenList);
        }
        else if (token.hasValue(Group.OPEN))
        {
            const next = this.#peekAfterBlock(tokenList, Group.OPEN, Group.CLOSE);

            if (next?.hasValue(Operator.ARROW))
            {
                return this.#parseArrowFunction(tokenList, isAsync);
            }

            return this.#parseExpression(tokenList);
        }
        else if (token.hasValue(Scope.OPEN))
        {
            return this.#parseObject(tokenList);
        }
        else if (token.hasValue(List.OPEN))
        {
            return this.#parseArray(tokenList);
        }
        else if (token.hasValue(Operator.NOT) || token.hasValue(Operator.SUBTRACT))
        {
            // Logical not or negative number
            return this.#parseExpression(tokenList);
        }
        else if (isDivider(token.value))
        {
            // Use cases:
            // - Terminator as end of statement
            // - Separator as multi declaration
            // - Scope as ternary else expression

            tokenList.step(); // Read away the divider

            return undefined;
        }

        throw new UnexpectedToken(token.value, token.start);
    }

    #parseMember(tokenList: TokenList, isAsync = false): ReflectionMember
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
                return this.#parseDeclaration(tokenList, false, true);

            case Keyword.ASYNC:
                return this.#parseMember(tokenList, true);

            default:
                throw new UnexpectedKeyword(token.value, token.start);
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
        else if (token.hasValue(Group.OPEN))
        {
            token = tokenList.step(); // Read away the open group

            const from = token.value;

            tokenList.step(2); // Read away the from value and scope close

            return new ReflectionImport(members, from);
        }

        if (token.hasValue(Scope.OPEN) === false)
        {
            // Keep the * indicator, otherwise use the default identifier
            const name = token.hasValue(Operator.MULTIPLY) ? Operator.MULTIPLY : DEFAULT_IDENTIFIER;
            
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

        if (token.hasValue(Divider.SEPARATOR))
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
            throw new ExpectedKeyword(Keyword.FROM, token.start);
        }

        token = tokenList.step(); // Read away the FROM keyword
        const from = token.value;

        tokenList.step(); // Read away the source

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

        const name = this.#isIdentifier(token) ? token.value : ANONYMOUS_IDENTIFIER;
        const as = isDefault ? DEFAULT_IDENTIFIER : name;
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

        if (token?.hasValue(Keyword.FROM))
        {
            token = tokenList.step(); // Read away the FROM keyword
            from = token.value;
        }

        tokenList.step(); // Read away the source

        return new ReflectionExport(members, from);
    }

    #parseAliasList(tokenList: TokenList): ReflectionAlias[]
    {
        const aliases = [];

        let token = tokenList.step(); // Read away the scope open

        while (tokenList.notAtEnd())
        {
            if (token.hasValue(Scope.CLOSE))
            {
                tokenList.step(); // Read away the scope close

                break;
            }

            if (token.hasValue(Divider.SEPARATOR))
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

    #parseDeclaration(tokenList: TokenList, isStatic: boolean, parseMultiple = false): ReflectionMember
    {
        let token = tokenList.current;
        let identifier: ReflectionIdentifier = ANONYMOUS_IDENTIFIER;
        let isPrivate = false;

        if (token.hasValue(List.OPEN))
        {
            identifier = this.#parseDestructuredArray(tokenList);
            token = tokenList.current;
        }
        else if (token.hasValue(Scope.OPEN))
        {
            identifier = this.#parseDestructuredObject(tokenList);
            token = tokenList.current;
        }
        else
        {
            isPrivate = token.value.startsWith(PRIVATE_INDICATOR);
            identifier = isPrivate ? token.value.substring(1) : token.value;
            token = tokenList.step(); // Read away the identifier
        }

        let value = undefined;

        if (token.hasValue(Operator.ASSIGN))
        {
            tokenList.step(); // Read away the assignment operator
            
            value = this.#parseNext(tokenList, false);
            token = tokenList.current;
        }

        if (token !== undefined)
        {
            if (token.hasValue(Divider.TERMINATOR))
            {
                tokenList.step(); // Read away the terminator
            }
            else if (parseMultiple === true && token.hasValue(Divider.SEPARATOR))
            {
                // Parse away the next declaration without saving it.
                // Note that this is a known limitation as described in the readme.
    
                tokenList.step(); // Read away the separator
    
                this.#parseDeclaration(tokenList, isStatic, true);
            }
        }

        // Now we have the value we need to check if we need to recreate it
        // with the correct name, static and private properties.

        if (value instanceof ReflectionGenerator)
        {
            return new ReflectionGenerator(identifier.toString(), value.parameters, value.body, isStatic, value.isAsync, isPrivate);
        }
        else if (value instanceof ReflectionFunction)
        {
            return new ReflectionFunction(identifier.toString(), value.parameters, value.body, isStatic, value.isAsync, isPrivate);
        }
        else if (value instanceof ReflectionClass)
        {
            return new ReflectionClass(identifier.toString(), value.parentName, value.scope);
        }

        return new ReflectionDeclaration(identifier, value as ReflectionValue, isStatic, isPrivate);
    }

    #parseFunction(tokenList: TokenList, isAsync: boolean, isStatic = false, isGetter = false, isSetter = false): ReflectionFunction
    {
        let token = tokenList.current;
        let name = ANONYMOUS_IDENTIFIER;
        let isGenerator = false;
        let isPrivate = false;

        if (token.hasValue(Operator.MULTIPLY))
        {
            isGenerator = true;

            token = tokenList.step(); // Read away the generator operator
        }

        if (this.#isIdentifier(token))
        {
            isPrivate = token.value.startsWith(PRIVATE_INDICATOR);
            name = isPrivate ? token.value.substring(1) : token.value;

            token = tokenList.step(); // Read away the function name
        }

        const parameters = this.#parseParameters(tokenList, Group.CLOSE);

        token = tokenList.current;

        if (token.hasValue(Scope.OPEN) === false)
        {
            throw new ExpectedToken(Scope.OPEN, token.start);
        }

        const body = this.#parseBlock(tokenList, Scope.OPEN, Scope.CLOSE);

        if (isGenerator)
        {
            return new ReflectionGenerator(name, parameters, body, isStatic, isAsync, isPrivate);
        }
        else if (isGetter)
        {
            return new ReflectionGetter(name, parameters, body, isStatic, isAsync, isPrivate);
        }
        else if (isSetter)
        {
            return new ReflectionSetter(name, parameters, body, isStatic, isAsync, isPrivate);
        }

        return new ReflectionFunction(name, parameters, body, isStatic, isAsync, isPrivate);
    }

    #parseArrowFunction(tokenList: TokenList, isAsync: boolean): ReflectionFunction
    {
        let token = tokenList.current;
        let parameters: ReflectionParameter[];

        if (token.hasValue(Group.OPEN))
        {
            parameters = this.#parseParameters(tokenList, Group.CLOSE);
            token = tokenList.current;
        }
        else
        {
            parameters = [new ReflectionField(token.value, undefined)];
            token = tokenList.step();
        }

        if (token.hasValue(Operator.ARROW) === false)
        {
            throw new ExpectedToken(Operator.ARROW, token.start);
        }

        token = tokenList.step(); // Read away the arrow

        const body = token.hasValue(Scope.OPEN)
            ? this.#parseBlock(tokenList, Scope.OPEN, Scope.CLOSE)
            : this.#parseExpression(tokenList).definition;

        return new ReflectionFunction(ANONYMOUS_IDENTIFIER, parameters, body, false, isAsync, false);
    }

    #parseParameters(tokenList: TokenList, closeId: string): ReflectionParameter[]
    {
        const parameters = [];

        tokenList.step(); // Read away the group open

        while (tokenList.notAtEnd())
        {
            const token = tokenList.current;

            if (token.hasValue(closeId))
            {
                // End of the parameter list

                tokenList.step(); // Read away the group close

                break;
            }
            else if (token.hasValue(Divider.SEPARATOR))
            {
                // End of parameter

                tokenList.step(); // Read away the separator

                continue;
            }

            let parameter;

            if (token.hasValue(Scope.OPEN))
            {
                parameter = this.#parseDestructuredObject(tokenList);
            }
            else if (token.hasValue(List.OPEN))
            {
                parameter = this.#parseDestructuredArray(tokenList);
            }
            else
            {
                parameter = this.#parseField(tokenList);
            }

            parameters.push(parameter);
        }

        return parameters;
    }

    #parseClass(tokenList: TokenList): ReflectionClass
    {
        let token = tokenList.current;
        let name = ANONYMOUS_IDENTIFIER;
        let parent: string | undefined = undefined;

        if (this.#isIdentifier(token))
        {
            name = token.value;

            token = tokenList.step(); // Read away the class name
        }

        if (token.hasValue(Keyword.EXTENDS))
        {
            token = tokenList.step(); // Read away the extends keyword
            parent = token.value;

            token = tokenList.step(); // Read away the extends name
        }

        if (token.hasValue(Scope.OPEN) === false)
        {
            throw new ExpectedToken(Scope.OPEN, token.start);
        }

        const scope = this.#parseClassScope(tokenList);

        return new ReflectionClass(name, parent, scope);
    }

    #parseClassScope(tokenList: TokenList): ReflectionScope
    {
        let token = tokenList.step(); // Read away the scope open

        const members = [];

        while (tokenList.notAtEnd())
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

        while (tokenList.notAtEnd())
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
            else if (token.hasValue(Operator.MULTIPLY))
            {
                // Generator function
                return this.#parseFunction(tokenList, isAsync, isStatic, false, false);
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

    #parseDestructuredArray(tokenList: TokenList): ReflectionDestructuredArray
    {
        const fields = this.#parseParameters(tokenList, List.CLOSE);

        return new ReflectionDestructuredArray(fields);
    }

    #parseObject(tokenList: TokenList): ReflectionObject
    {
        const fields = this.#parseBlock(tokenList, Scope.OPEN, Scope.CLOSE);

        return new ReflectionObject(fields);
    }

    #parseDestructuredObject(tokenList: TokenList): ReflectionDestructuredObject
    {
        const fields = this.#parseParameters(tokenList, Scope.CLOSE);

        return new ReflectionDestructuredObject(fields);
    }

    #parseField(tokenList: TokenList): ReflectionField
    {
        let token = tokenList.current;

        const name = token.value;

        token = tokenList.step(); // Read away the name

        let value = undefined;

        if (token.hasValue(Operator.ASSIGN))
        {
            tokenList.step(); // Read away the assignment operator
            
            value = this.#parseNext(tokenList, false) as ReflectionValue;
        }

        return new ReflectionField(name, value);
    }

    #parseExpression(tokenList: TokenList): ReflectionExpression
    {
        let token = tokenList.current;
        let code = '';

        while (tokenList.notAtEnd())
        {
            if (token.hasValue(List.OPEN))
            {
                const array = this.#parseBlock(tokenList, List.OPEN, List.CLOSE);

                code += array + DEFINITION_SEPARATOR;
                token = tokenList.current;
            }
            else if (token.hasValue(Group.OPEN))
            {
                const group = this.#parseBlock(tokenList, Group.OPEN, Group.CLOSE);

                code += group + DEFINITION_SEPARATOR;
                token = tokenList.current;
            }
            else if (token.hasValue(Scope.OPEN))
            {
                const scope = this.#parseBlock(tokenList, Scope.OPEN, Scope.CLOSE);

                code += scope + DEFINITION_SEPARATOR;
                token = tokenList.current;
            }
            else
            {
                code += token.toString() + DEFINITION_SEPARATOR;
                token = tokenList.step();
            }

            if (token === undefined || this.#atEndOfStatement(token))
            {
                // End of the list

                break;
            }
        }

        return new ReflectionExpression(code.trim());
    }

    #parseBlock(tokenList: TokenList, openId: string, closeId: string): string
    {
        let token = tokenList.step(); // Read away the open

        let code = openId + DEFINITION_SEPARATOR;

        while (tokenList.notAtEnd())
        {
            if (token.hasValue(openId))
            {
                code += this.#parseBlock(tokenList, openId, closeId) + DEFINITION_SEPARATOR;
                token = tokenList.current;

                continue;
            }
            else if (token.hasValue(closeId))
            {
                tokenList.step(); // Read away the close

                code += closeId;

                return code;
            }

            code += token.toString() + DEFINITION_SEPARATOR;
            token = tokenList.step();
        }

        return code;
    }

    #peekAfterBlock(tokenList: TokenList, openId: string, closeId: string): Token | undefined
    {
        const start = tokenList.position;

        this.#parseBlock(tokenList, openId, closeId);

        const token = tokenList.current;
        const end = tokenList.position;

        tokenList.stepBack(end - start);

        return token;
    }

    #atEndOfStatement(token: Token): boolean
    {
        return [Divider.TERMINATOR, Divider.SEPARATOR].includes(token.value)
            || [List.CLOSE, Group.CLOSE, Scope.CLOSE].includes(token.value)
            || isKeyword(token.value);
    }

    #isIdentifier(token: Token): boolean
    {
        return token.isType(TokenType.IDENTIFIER)
            || (token.isType(TokenType.KEYWORD) && isNotReserved(token.value));
    }
}
