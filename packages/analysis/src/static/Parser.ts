
import type { ClassVisibility, ClassLocation, VariableType } from '../model';
import {
    ESBinding, ESIdentifierBinding, ESArrayBinding, ESObjectBinding, ESBindingElement,
    ESBlock, ESExpression, ESVariable,
    ESFunction, ESArrowFunction, ESGeneratorFunction, ESParameter,
    ESClass, ESClassMember, ESField, ESMethod, ESGeneratorMethod, ESConstructor, ESGetter, ESSetter,
    ESModule, ESModuleMember, ESExport, ESImport, ESStatement
} from '../model';

import { Divider, isDivider } from './definitions/Divider';
import { Group } from './definitions/Group';
import { Keyword, isDeclaration, isRootKeyword, isContextualKeyword, isNotRootKeyword } from './definitions/Keyword';
import { List } from './definitions/List';
import { Operator } from './definitions/Operator';
import { Indicator } from './definitions/Indicator';
import { Scope } from './definitions/Scope';
import { TokenType } from './definitions/TokenType';

import ExpectedKeyword from './errors/ExpectedKeyword';
import ExpectedToken from './errors/ExpectedToken';
import UnexpectedKeyword from './errors/UnexpectedKeyword';
import UnexpectedParseResult from './errors/UnexpectedParseResult';
import UnexpectedToken from './errors/UnexpectedToken';

import Token from './models/Token';
import TokenList from './models/TokenList';

import Lexer from './Lexer';

const ANONYMOUS_IDENTIFIER = '';
const DEFAULT_IDENTIFIER = 'default';
const DEFINITION_SEPARATOR = ' ';

export default class Parser
{
    readonly #lexer: Lexer;

    constructor(lexer = new Lexer())
    {
        this.#lexer = lexer;
    }

    parse(code: string): ESModule
    {
        const tokenList = this.#lexer.tokenize(code);
        const statements = this.#parseAll(tokenList);

        return new ESModule(statements);
    }

    parseStatement(code: string): ESStatement
    {
        const tokenList = this.#lexer.tokenize(code);
        const statement = this.#parseNext(tokenList);

        if (statement === undefined)
        {
            throw new UnexpectedParseResult('a statement');
        }

        return statement;
    }

    parseImport(code: string): ESImport
    {
        const tokenList = this.#lexer.tokenize(code);
        const declaration = this.#parseKeyword(tokenList);

        if ((declaration instanceof ESImport) === false)
        {
            throw new UnexpectedParseResult('an import definition');
        }

        return declaration;
    }

    parseExport(code: string): ESExport
    {
        const tokenList = this.#lexer.tokenize(code);
        const declaration = this.#parseKeyword(tokenList);

        if ((declaration instanceof ESExport) === false)
        {
            throw new UnexpectedParseResult('an export definition');
        }

        return declaration;
    }

    parseVariable(code: string): ESVariable
    {
        const tokenList = this.#lexer.tokenize(code);
        const declaration = this.#parseKeyword(tokenList);

        if ((declaration instanceof ESVariable) === false)
        {
            throw new UnexpectedParseResult('a variable definition');
        }

        return declaration;
    }

    parseFunction(code: string): ESFunction
    {
        const tokenList = this.#lexer.tokenize(code);
        const declaration = this.#parseKeyword(tokenList);

        if ((declaration instanceof ESFunction) === false)
        {
            throw new UnexpectedParseResult('a function definition');
        }

        return declaration;
    }

    parseClass(code: string): ESClass
    {
        const tokenList = this.#lexer.tokenize(code);
        const declaration = this.#parseKeyword(tokenList);

        if ((declaration instanceof ESClass) === false)
        {
            throw new UnexpectedParseResult('a class definition');
        }

        return declaration;
    }

    #parseAll(tokenList: TokenList): ESStatement[]
    {
        const statements: ESStatement[] = [];

        while (tokenList.notAtEnd())
        {
            const statement = this.#parseNext(tokenList);

            if (statement === undefined)
            {
                continue;
            }

            statements.push(statement);
        }

        return statements;
    }

    #parseNext(tokenList: TokenList, isAsync = false): ESStatement | undefined
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
            if (isContextualKeyword(token.value))
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

            if (isNotRootKeyword(token.value))
            {
                return this.#parseExpression(tokenList);
            }

            return this.#parseKeyword(tokenList, isAsync);
        }
        else if (token.isType(TokenType.REGEX))
        {
            return this.#parseExpression(tokenList);
        }
        else if (token.hasValue(Group.OPEN))
        {
            const next = this.#peekAfterCollection(tokenList, Group.OPEN, Group.CLOSE);

            if (next?.hasValue(Operator.ARROW))
            {
                return this.#parseArrowFunction(tokenList, isAsync);
            }

            return this.#parseExpression(tokenList);
        }
        else if (token.hasValue(Scope.OPEN))
        {
            // Object value
            return this.#parseExpression(tokenList);
        }
        else if (token.hasValue(List.OPEN))
        {
            // Array value
            return this.#parseExpression(tokenList);
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

    #parseKeyword(tokenList: TokenList, isAsync = false): ESStatement | undefined
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
                return this.#parseVariable(tokenList, 'var');

            case Keyword.LET:
                return this.#parseVariable(tokenList, 'let');

            case Keyword.CONST:
                return this.#parseVariable(tokenList, 'const');

            case Keyword.ASYNC:
                return this.#parseNext(tokenList, true);

            default:
                throw new UnexpectedKeyword(token.value, token.start);
        }
    }

    #parseImport(tokenList: TokenList): ESImport
    {
        const members: ESModuleMember[] = [];

        let token = tokenList.current;

        if (token.isType(TokenType.LITERAL))
        {
            const from = this.#parseFrom(token.value);

            return new ESImport(members, from);
        }
        else if (token.hasValue(Group.OPEN))
        {
            token = tokenList.step(); // Read away the open group

            const from = this.#parseFrom(token.value);

            tokenList.step(2); // Read away the from value and scope close

            return new ESImport(members, from);
        }

        if (token.hasValue(Scope.OPEN) === false)
        {
            // Keep the * indicator, otherwise use the default identifier
            const identifier = token.hasValue(Operator.MULTIPLY) ? Operator.MULTIPLY : DEFAULT_IDENTIFIER;

            let alias = token.value;

            token = tokenList.step(); // Read away the identifier

            if (token.hasValue(Keyword.AS))
            {
                token = tokenList.step(); // Read away the AS keyword
                alias = token.value;

                token = tokenList.step(); // Read away the alias identifier
            }

            members.push(new ESModuleMember(identifier, alias));
        }

        if (token.hasValue(Divider.SEPARATOR))
        {
            token = tokenList.step(); // Read away the separator
        }

        if (token.hasValue(Scope.OPEN))
        {
            const parsedMembers = this.#parseModuleMembers(tokenList);

            members.push(...parsedMembers);

            token = tokenList.current;
        }

        if (token.hasValue(Keyword.FROM) === false)
        {
            throw new ExpectedKeyword(Keyword.FROM, token.start);
        }

        token = tokenList.step(); // Read away the FROM keyword

        const from = this.#parseFrom(token.value);

        tokenList.step(); // Read away the source

        return new ESImport(members, from);
    }

    #parseExport(tokenList: TokenList): ESExport
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

    #parseSingleExport(tokenList: TokenList, isDefault: boolean): ESExport
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

        const identifier = this.#isIdentifier(token) ? token.value : ANONYMOUS_IDENTIFIER;
        const alias = isDefault ? DEFAULT_IDENTIFIER : undefined;

        let from: string | undefined = undefined;

        token = tokenList.step(); // Read away the name

        if (token?.hasValue(Keyword.FROM))
        {
            token = tokenList.step(); // Read away the FROM keyword
            from = this.#parseFrom(token.value);
        }

        if (stepSize > 0)
        {
            stepSize++; // Include the name when stepping back

            tokenList.stepBack(stepSize); // Step back to the original position
        }

        const member = new ESModuleMember(identifier, alias);

        return new ESExport([member], from);
    }

    #parseMultiExport(tokenList: TokenList): ESExport
    {
        const members = this.#parseModuleMembers(tokenList);

        let from: string | undefined = undefined;
        let token = tokenList.current;

        if (token?.hasValue(Keyword.FROM))
        {
            token = tokenList.step(); // Read away the FROM keyword
            from = this.#parseFrom(token.value);
        }

        tokenList.step(); // Read away the source

        return new ESExport(members, from);
    }

    #parseFrom(from: string): string
    {
        return from.slice(1, -1);
    }

    #parseModuleMembers(tokenList: TokenList): ESModuleMember[]
    {
        const members = [];

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

            const member = this.#parseModuleMember(tokenList);

            members.push(member);

            token = tokenList.step();
        }

        return members;
    }

    #parseModuleMember(tokenList: TokenList): ESModuleMember
    {
        let token = tokenList.current;

        const identifier = token.value;
        let alias: string | undefined = undefined;

        if (tokenList.next.hasValue(Keyword.AS))
        {
            token = tokenList.step(2); // Read away the AS keyword
            alias = token.value;
        }

        return new ESModuleMember(identifier, alias);
    }

    #parseVariable(tokenList: TokenList, type: VariableType): ESVariable
    {
        const binding = this.#parseBinding(tokenList);
        const initializer = this.#parseInitializer(tokenList);

        return new ESVariable(type, binding, initializer);
    }

    #parseBinding(tokenList: TokenList): ESBinding
    {
        const token = tokenList.current;
        
        if (token.hasValue(List.OPEN))
        {
            return this.#parseArrayBinding(tokenList);
        }
        else if (token.hasValue(Scope.OPEN))
        {
            return this.#parseObjectBinding(tokenList);
        }
        
        return this.#parseIdentifierBinding(tokenList);
    }

    #parseArrayBinding(tokenList: TokenList): ESArrayBinding
    {
        const elements = this.#parseBindingElements(tokenList, List.CLOSE);

        return new ESArrayBinding(elements);
    }

    #parseObjectBinding(tokenList: TokenList): ESObjectBinding
    {
        const elements = this.#parseBindingElements(tokenList, Scope.CLOSE);

        return new ESObjectBinding(elements);
    }

    #parseBindingElements(tokenList: TokenList, closeId: string): ESBindingElement[]
    {
        const elements = [];

        tokenList.step(); // Read away the group open

        while (tokenList.notAtEnd())
        {
            const token = tokenList.current;

            if (token.hasValue(closeId))
            {
                // End of the element list

                tokenList.step(); // Read away the group close

                break;
            }
            else if (token.hasValue(Divider.SEPARATOR))
            {
                // End of element

                tokenList.step(); // Read away the separator

                continue;
            }

            const binding = this.#parseBinding(tokenList);
            const initializer = this.#parseInitializer(tokenList);

            const element = new ESBindingElement(binding, initializer);
            elements.push(element);
        }

        return elements;
    }

    #parseIdentifierBinding(tokenList: TokenList): ESIdentifierBinding
    {
        const token = tokenList.current;
        const identifier = token.value;

        tokenList.step(); // Read away the identifier

        return new ESIdentifierBinding(identifier);
    }

    #parseInitializer(tokenList: TokenList): ESStatement | undefined
    {
        const token = tokenList.current;

        if (token.hasValue(Operator.ASSIGN) === false)
        {
            if (token.hasValue(Divider.TERMINATOR))
            {
                tokenList.step(); // Read away the terminator
            }

            return undefined;
        }

        tokenList.step(); // Read away the assignment operator

        return this.#parseNext(tokenList, false);
    }

    #parseFunction(tokenList: TokenList, isAsync: boolean): ESFunction
    {
        let token = tokenList.current;
        let identifier: string | undefined = undefined;
        let isGenerator = false;

        if (token.hasValue(Indicator.GENERATOR))
        {
            isGenerator = true;

            token = tokenList.step(); // Read away the generator operator
        }

        if (this.#isIdentifier(token))
        {
            identifier = token.value;

            tokenList.step(); // Read away the function identifier
        }

        const parameters = this.#parseBindingElements(tokenList, Group.CLOSE);

        token = tokenList.current;

        if (token.hasValue(Scope.OPEN) === false)
        {
            throw new ExpectedToken(Scope.OPEN, token.start);
        }

        const body = this.#parseBlock(tokenList);

        if (isGenerator)
        {
            return new ESGeneratorFunction(identifier, parameters, body, isAsync);
        }
        
        return new ESFunction(identifier, parameters, body, isAsync);
    }

    #parseArrowFunction(tokenList: TokenList, isAsync: boolean): ESArrowFunction
    {
        let token = tokenList.current;
        let parameters: ESParameter[];

        if (token.hasValue(Group.OPEN))
        {
            parameters = this.#parseBindingElements(tokenList, Group.CLOSE);
        }
        else
        {
            const binding = this.#parseIdentifierBinding(tokenList);
            const parameter = new ESBindingElement(binding, undefined);

            parameters = [parameter];
        }

        token = tokenList.current;

        if (token.hasValue(Operator.ARROW) === false)
        {
            throw new ExpectedToken(Operator.ARROW, token.start);
        }

        token = tokenList.step(); // Read away the arrow

        let body: ESBlock;

        if (token.hasValue(Scope.OPEN))
        {
            body = this.#parseBlock(tokenList);
        }
        else
        {
            const expression = this.#parseExpression(tokenList);

            body = new ESBlock(expression.code);
        }

        return new ESArrowFunction(parameters, body, isAsync);
    }

    #parseClass(tokenList: TokenList): ESClass
    {
        let token = tokenList.current;

        let identifier: string | undefined = undefined;
        let parent: string | undefined = undefined;

        if (this.#isIdentifier(token))
        {
            identifier = token.value;

            token = tokenList.step(); // Read away the class identifier
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

        const members = this.#parseClassMembers(tokenList);

        return new ESClass(identifier, parent, members);
    }

    #parseClassMembers(tokenList: TokenList): ESClassMember[]
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

        return members;
    }

    #parseClassMember(tokenList: TokenList): ESClassMember
    {
        let token = tokenList.current;

        let visibility: ClassVisibility = 'public';
        let location: ClassLocation = 'instance';
        let isAsync = false;

        while (tokenList.notAtEnd())
        {
            if (token.hasValue(Indicator.PRIVATE))
            {
                visibility = 'private';
            }
            else if (token.hasValue(Keyword.STATIC))
            {
                location = 'static';
            }
            else if (token.hasValue(Keyword.ASYNC))
            {
                isAsync = true;
            }
            else if (token.hasValue(Keyword.CONSTRUCTOR))
            {
                return this.#parseConstructor(tokenList);
            }
            else if (token.hasValue(Keyword.GET))
            {
                return this.#parseGetter(tokenList, location);
            }
            else if (token.hasValue(Keyword.SET))
            {
                return this.#parseSetter(tokenList, location);
            }
            else if (token.hasValue(Indicator.GENERATOR))
            {
                tokenList.step(); // Read away the generator indicator

                return this.#parseMethod(tokenList, visibility, location, isAsync, true);
            }
            else
            {
                break;
            }

            token = tokenList.step();
        }

        const nextToken = tokenList.next;

        return nextToken.hasValue(Group.OPEN)
            ? this.#parseMethod(tokenList, visibility, location, isAsync, false)
            : this.#parseField(tokenList, visibility, location);
    }

    #parseConstructor(tokenList: TokenList): ESConstructor
    {
        tokenList.step(); // Read away the constructor keyword
        
        const parameters = this.#parseBindingElements(tokenList, Group.CLOSE);

        const token = tokenList.current;

        if (token.hasValue(Scope.OPEN) === false)
        {
            throw new ExpectedToken(Scope.OPEN, token.start);
        }

        const body = this.#parseBlock(tokenList);

        return new ESConstructor(parameters, body);
    }

    #parseGetter(tokenList: TokenList, location: ClassLocation): ESGetter
    {
        let visibility: ClassVisibility = 'public';

        let token = tokenList.step(); // Read away the get keyword
        
        if (token.hasValue(Indicator.PRIVATE))
        {
            visibility = 'private';

            token = tokenList.step(); // Read away the private indicator
        }

        const identifier = token.value;

        tokenList.step(); // Read away the identifier

        const parameters = this.#parseBindingElements(tokenList, Group.CLOSE);

        if (parameters.length !== 0)
        {
            throw new UnexpectedParseResult('an empty parameter list');
        }

        token = tokenList.current;

        if (token.hasValue(Scope.OPEN) === false)
        {
            throw new ExpectedToken(Scope.OPEN, token.start);
        }

        const body = this.#parseBlock(tokenList);

        return new ESGetter(identifier, visibility, location, body);
    }

    #parseSetter(tokenList: TokenList, location: ClassLocation): ESSetter
    {
        let visibility: ClassVisibility = 'public';

        let token = tokenList.step(); // Read away the get keyword
        
        if (token.hasValue(Indicator.PRIVATE))
        {
            visibility = 'private';

            token = tokenList.step(); // Read away the private indicator
        }

        const identifier = token.value;

        tokenList.step(); // Read away the identifier
        
        const parameters = this.#parseBindingElements(tokenList, Group.CLOSE);

        token = tokenList.current;

        if (parameters.length !== 1)
        {
            throw new UnexpectedParseResult('exactly one setter parameter');
        }

        if (token.hasValue(Scope.OPEN) === false)
        {
            throw new ExpectedToken(Scope.OPEN, token.start);
        }

        const body = this.#parseBlock(tokenList);

        return new ESSetter(identifier, visibility, location, parameters[0], body);
    }

    #parseMethod(tokenList: TokenList, visibility: ClassVisibility, location: ClassLocation, isAsync: boolean, isGenerator: boolean): ESMethod
    {
        let token = tokenList.current;
        
        const identifier = token.value;

        tokenList.step(); // Read away the identifier

        const parameters = this.#parseBindingElements(tokenList, Group.CLOSE);

        token = tokenList.current;

        if (token.hasValue(Scope.OPEN) === false)
        {
            throw new ExpectedToken(Scope.OPEN, token.start);
        }

        const body = this.#parseBlock(tokenList);

        if (isGenerator)
        {
            return new ESGeneratorMethod(identifier, visibility, location, parameters, body, isAsync);
        }

        return new ESMethod(identifier, visibility, location, parameters, body, isAsync);
    }

    #parseField(tokenList: TokenList, visibility: ClassVisibility, location: ClassLocation): ESField
    {
        const token = tokenList.current;

        const identifier = token.value;

        tokenList.step(); // Read away the name

        const initializer = this.#parseInitializer(tokenList);

        return new ESField(identifier, visibility, location, initializer);
    }

    #parseBlock(tokenList: TokenList): ESBlock
    {
        const code = this.#parseCollectionToCode(tokenList, Scope.OPEN, Scope.CLOSE);

        return new ESBlock(code);
    }

    #parseExpression(tokenList: TokenList): ESExpression
    {
        let token = tokenList.current;
        let code = '';

        while (tokenList.notAtEnd())
        {
            if (token.hasValue(List.OPEN))
            {
                const array = this.#parseCollectionToCode(tokenList, List.OPEN, List.CLOSE);

                code += array + DEFINITION_SEPARATOR;
                token = tokenList.current;
            }
            else if (token.hasValue(Group.OPEN))
            {
                const group = this.#parseCollectionToCode(tokenList, Group.OPEN, Group.CLOSE);

                code += group + DEFINITION_SEPARATOR;
                token = tokenList.current;
            }
            else if (token.hasValue(Scope.OPEN))
            {
                const scope = this.#parseCollectionToCode(tokenList, Scope.OPEN, Scope.CLOSE);

                code += scope + DEFINITION_SEPARATOR;
                token = tokenList.current;
            }
            else
            {
                code += token.toString() + DEFINITION_SEPARATOR;
                token = tokenList.step();
            }

            if (token === undefined)
            {
                break;
            }

            if (this.#atEndOfStatement(token))
            {
                if (token.hasValue(Divider.TERMINATOR))
                {
                    tokenList.step(); // Read away the terminator
                }

                break;
            }
        }

        return new ESExpression(code.trim());
    }

    #parseCollectionToCode(tokenList: TokenList, openId: string, closeId: string): string
    {
        let token = tokenList.step(); // Read away the open
        let code = openId + DEFINITION_SEPARATOR;

        while (tokenList.notAtEnd())
        {
            if (token.hasValue(openId))
            {
                code += this.#parseCollectionToCode(tokenList, openId, closeId) + DEFINITION_SEPARATOR;
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

    #peekAfterCollection(tokenList: TokenList, openId: string, closeId: string): Token | undefined
    {
        const start = tokenList.position;

        this.#parseCollectionToCode(tokenList, openId, closeId);

        const token = tokenList.current;
        const end = tokenList.position;

        tokenList.stepBack(end - start);

        return token;
    }

    #atEndOfStatement(token: Token): boolean
    {
        return [Divider.TERMINATOR, Divider.SEPARATOR].includes(token.value)
            || [List.CLOSE, Group.CLOSE, Scope.CLOSE].includes(token.value)
            || isRootKeyword(token.value);
    }

    #isIdentifier(token: Token): boolean
    {
        return token.isType(TokenType.IDENTIFIER)
            || (token.isType(TokenType.KEYWORD) && isContextualKeyword(token.value));
    }
}
