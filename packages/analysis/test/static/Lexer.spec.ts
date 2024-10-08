
import { describe, expect, it } from 'vitest';

import { Divider, Group, Keyword, List, Operator, Scope, TokenType, Lexer } from '../../src/static';

import { CODE } from './fixtures';

const lexer = new Lexer();

describe('parser/Lexer', () =>
{
    describe('.tokenize(code, ignoreComments)', () =>
    {
        it('should separate operators', () =>
        {
            const tokens = lexer.tokenize(CODE.OPERATORS);
            expect(tokens.size).toBe(6);

            expect(tokens.get(0).type).toBe(TokenType.OPERATOR);
            expect(tokens.get(0).value).toBe(Operator.EQUAL_STRICT);

            expect(tokens.get(1).type).toBe(TokenType.OPERATOR);
            expect(tokens.get(1).value).toBe(Operator.EQUAL);

            expect(tokens.get(2).type).toBe(TokenType.OPERATOR);
            expect(tokens.get(2).value).toBe(Operator.NOT_EQUAL);

            expect(tokens.get(3).type).toBe(TokenType.OPERATOR);
            expect(tokens.get(3).value).toBe(Operator.ASSIGN_ADD);

            expect(tokens.get(4).type).toBe(TokenType.OPERATOR);
            expect(tokens.get(4).value).toBe(Operator.MULTIPLY);

            expect(tokens.get(5).type).toBe(TokenType.OPERATOR);
            expect(tokens.get(5).value).toBe(Operator.NOT_EQUAL);
        });

        it('should separate keywords from literals', () =>
        {
            const tokens = lexer.tokenize(CODE.LITERALS);
            expect(tokens.size).toBe(3);

            expect(tokens.get(0).type).toBe(TokenType.LITERAL);
            expect(tokens.get(0).value).toBe('`foo\\`ter`');

            expect(tokens.get(1).type).toBe(TokenType.LITERAL);
            expect(tokens.get(1).value).toBe('"bar\\"becue"');

            expect(tokens.get(2).type).toBe(TokenType.LITERAL);
            expect(tokens.get(2).value).toBe("'baz'");
        });

        it('should separate keywords from identifiers', () =>
        {
            const tokens = lexer.tokenize(CODE.KEYWORDS_IDENTIFIERS);
            expect(tokens.size).toBe(4);

            expect(tokens.get(0).type).toBe(TokenType.KEYWORD);
            expect(tokens.get(0).value).toBe('class');

            expect(tokens.get(1).type).toBe(TokenType.IDENTIFIER);
            expect(tokens.get(1).value).toBe('Foo');

            expect(tokens.get(2).type).toBe(TokenType.KEYWORD);
            expect(tokens.get(2).value).toBe('function');

            expect(tokens.get(3).type).toBe(TokenType.IDENTIFIER);
            expect(tokens.get(3).value).toBe('bar');
        });

        it('should tokenize a code statement', () =>
        {
            const tokens = lexer.tokenize(CODE.STATEMENT);
            expect(tokens.size).toBe(17);

            expect(tokens.get(0).type).toBe(TokenType.KEYWORD);
            expect(tokens.get(0).value).toBe('const');

            expect(tokens.get(1).type).toBe(TokenType.IDENTIFIER);
            expect(tokens.get(1).value).toBe('identifier');

            expect(tokens.get(2).type).toBe(TokenType.OPERATOR);
            expect(tokens.get(2).value).toBe(Operator.ASSIGN);

            expect(tokens.get(3).type).toBe(TokenType.GROUP);
            expect(tokens.get(3).value).toBe(Group.OPEN);

            expect(tokens.get(4).type).toBe(TokenType.IDENTIFIER);
            expect(tokens.get(4).value).toBe('12');

            expect(tokens.get(5).type).toBe(TokenType.OPERATOR);
            expect(tokens.get(5).value).toBe(Operator.GREATER_EQUAL);

            expect(tokens.get(6).type).toBe(TokenType.IDENTIFIER);
            expect(tokens.get(6).value).toBe('3');

            expect(tokens.get(7).type).toBe(TokenType.GROUP);
            expect(tokens.get(7).value).toBe(Group.CLOSE);

            expect(tokens.get(8).type).toBe(TokenType.OPERATOR);
            expect(tokens.get(8).value).toBe(Operator.TERNARY);

            expect(tokens.get(9).type).toBe(TokenType.SCOPE);
            expect(tokens.get(9).value).toBe(Scope.OPEN);

            expect(tokens.get(10).type).toBe(TokenType.LITERAL);
            expect(tokens.get(10).value).toBe("'foo'");

            expect(tokens.get(11).type).toBe(TokenType.SCOPE);
            expect(tokens.get(11).value).toBe(Scope.CLOSE);

            expect(tokens.get(12).type).toBe(TokenType.DIVIDER);
            expect(tokens.get(12).value).toBe(Divider.SCOPE);

            expect(tokens.get(13).type).toBe(TokenType.LIST);
            expect(tokens.get(13).value).toBe(List.OPEN);

            expect(tokens.get(14).type).toBe(TokenType.LITERAL);
            expect(tokens.get(14).value).toBe('"bar"');

            expect(tokens.get(15).type).toBe(TokenType.LIST);
            expect(tokens.get(15).value).toBe(List.CLOSE);

            expect(tokens.get(16).type).toBe(TokenType.DIVIDER);
            expect(tokens.get(16).value).toBe(Divider.TERMINATOR);
        });

        it('should tokenize a regex statement', () =>
        {
            const tokens = lexer.tokenize(CODE.REGEX_STATEMENT);
            expect(tokens.size).toBe(8);

            expect(tokens.get(0).type).toBe(TokenType.KEYWORD);
            expect(tokens.get(0).value).toBe(Keyword.CONST);

            expect(tokens.get(1).type).toBe(TokenType.IDENTIFIER);
            expect(tokens.get(1).value).toBe('regex');

            expect(tokens.get(2).type).toBe(TokenType.OPERATOR);
            expect(tokens.get(2).value).toBe(Operator.ASSIGN);

            expect(tokens.get(3).type).toBe(TokenType.REGEX);
            expect(tokens.get(3).value).toBe(`/[\\"]['"]/g`);

            expect(tokens.get(4).type).toBe(TokenType.IDENTIFIER);
            expect(tokens.get(4).value).toBe('.test');

            expect(tokens.get(5).type).toBe(TokenType.GROUP);
            expect(tokens.get(5).value).toBe(Group.OPEN);

            expect(tokens.get(6).type).toBe(TokenType.LITERAL);
            expect(tokens.get(6).value).toBe("'foo'");

            expect(tokens.get(7).type).toBe(TokenType.GROUP);
            expect(tokens.get(7).value).toBe(Group.CLOSE);
        });

        it('should tokenize a regex array', () =>
        {
            const tokens = lexer.tokenize(CODE.REGEX_ARRAY);
            expect(tokens.size).toBe(5);

            expect(tokens.get(0).type).toBe(TokenType.LIST);
            expect(tokens.get(0).value).toBe(List.OPEN);

            expect(tokens.get(1).type).toBe(TokenType.REGEX);
            expect(tokens.get(1).value).toBe(`/[\\"]['"]/g`);

            expect(tokens.get(2).type).toBe(TokenType.DIVIDER);
            expect(tokens.get(2).value).toBe(Divider.SEPARATOR);

            expect(tokens.get(3).type).toBe(TokenType.REGEX);
            expect(tokens.get(3).value).toBe(`/Windows (?:NT|Phone) ([0-9.]+)/`);

            expect(tokens.get(4).type).toBe(TokenType.LIST);
            expect(tokens.get(4).value).toBe(List.CLOSE);
        });

        it('should tokenize a regex object', () =>
        {
            const tokens = lexer.tokenize(CODE.REGEX_OBJECT);
            expect(tokens.size).toBe(5);

            expect(tokens.get(0).type).toBe(TokenType.SCOPE);
            expect(tokens.get(0).value).toBe(Scope.OPEN);

            expect(tokens.get(1).type).toBe(TokenType.IDENTIFIER);
            expect(tokens.get(1).value).toBe('test');

            expect(tokens.get(2).type).toBe(TokenType.DIVIDER);
            expect(tokens.get(2).value).toBe(Divider.SCOPE);

            expect(tokens.get(3).type).toBe(TokenType.REGEX);
            expect(tokens.get(3).value).toBe(`/[\\"]['"]/g`);

            expect(tokens.get(4).type).toBe(TokenType.SCOPE);
            expect(tokens.get(4).value).toBe(Scope.CLOSE);
        });

        it('should tokenize a regex result', () =>
        {
            const tokens = lexer.tokenize(CODE.REGEX_RESULT);
            expect(tokens.size).toBe(3);

            expect(tokens.get(0).type).toBe(TokenType.KEYWORD);
            expect(tokens.get(0).value).toBe(Keyword.RETURN);

            expect(tokens.get(1).type).toBe(TokenType.REGEX);
            expect(tokens.get(1).value).toBe(`/[\\"]['"]/g`);

            expect(tokens.get(2).type).toBe(TokenType.DIVIDER);
            expect(tokens.get(2).value).toBe(Divider.TERMINATOR);
        });

        it('should tokenize a regex argument', () =>
        {
            const tokens = lexer.tokenize(CODE.REGEX_ARGUMENT);
            expect(tokens.size).toBe(4);

            expect(tokens.get(0).type).toBe(TokenType.IDENTIFIER);
            expect(tokens.get(0).value).toBe('doSomething');

            expect(tokens.get(1).type).toBe(TokenType.GROUP);
            expect(tokens.get(1).value).toBe(Group.OPEN);

            expect(tokens.get(2).type).toBe(TokenType.REGEX);
            expect(tokens.get(2).value).toBe(`/[\\"]['"]/g`);

            expect(tokens.get(3).type).toBe(TokenType.GROUP);
            expect(tokens.get(3).value).toBe(Group.CLOSE);
        });

        it('should tokenize minified code', () =>
        {
            const tokens = lexer.tokenize(CODE.MINIFIED);
            expect(tokens.size).toBe(6);

            expect(tokens.get(0).type).toBe(TokenType.KEYWORD);
            expect(tokens.get(0).value).toBe(Keyword.RETURN);

            expect(tokens.get(1).type).toBe(TokenType.LITERAL);
            expect(tokens.get(1).value).toBe('`foo`');

            expect(tokens.get(2).type).toBe(TokenType.DIVIDER);
            expect(tokens.get(2).value).toBe(Divider.TERMINATOR);

            expect(tokens.get(3).type).toBe(TokenType.IDENTIFIER);
            expect(tokens.get(3).value).toBe('identifier1');

            expect(tokens.get(4).type).toBe(TokenType.OPERATOR);
            expect(tokens.get(4).value).toBe(Operator.ASSIGN);

            expect(tokens.get(5).type).toBe(TokenType.IDENTIFIER);
            expect(tokens.get(5).value).toBe('identifier2');
        });
    });
});
