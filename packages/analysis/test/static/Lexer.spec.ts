
import { describe, expect, it } from 'vitest';

import { Divider, Group, Keyword, List, Operator, Scope, TokenType, Lexer } from '../../src/static';

import { CODE } from './fixtures';

const lexer = new Lexer();

describe('Lexer', () =>
{
    describe('Tokenize', () =>
    {
        it('should distinguish value types', () =>
        {
            const tokens = lexer.tokenize(CODE.VALUES);
            expect(tokens.size).toEqual(7);

            expect(tokens.get(0).type).toEqual(TokenType.NUMBER);
            expect(tokens.get(0).value).toEqual('42');

            expect(tokens.get(1).type).toEqual(TokenType.IDENTIFIER);
            expect(tokens.get(1).value).toEqual('hello');

            expect(tokens.get(2).type).toEqual(TokenType.LITERAL);
            expect(tokens.get(2).value).toEqual('"world"');

            expect(tokens.get(3).type).toEqual(TokenType.BOOLEAN);
            expect(tokens.get(3).value).toEqual('true');

            expect(tokens.get(4).type).toEqual(TokenType.BOOLEAN);
            expect(tokens.get(4).value).toEqual('false');

            expect(tokens.get(5).type).toEqual(TokenType.NOTHING);
            expect(tokens.get(5).value).toEqual('undefined');

            expect(tokens.get(6).type).toEqual(TokenType.NOTHING);
            expect(tokens.get(6).value).toEqual('null');
        });

        it('should separate operators', () =>
        {
            const tokens = lexer.tokenize(CODE.OPERATORS);
            expect(tokens.size).toEqual(6);

            expect(tokens.get(0).type).toEqual(TokenType.OPERATOR);
            expect(tokens.get(0).value).toEqual(Operator.EQUAL_STRICT);

            expect(tokens.get(1).type).toEqual(TokenType.OPERATOR);
            expect(tokens.get(1).value).toEqual(Operator.EQUAL);

            expect(tokens.get(2).type).toEqual(TokenType.OPERATOR);
            expect(tokens.get(2).value).toEqual(Operator.NOT_EQUAL);

            expect(tokens.get(3).type).toEqual(TokenType.OPERATOR);
            expect(tokens.get(3).value).toEqual(Operator.ASSIGN_ADD);

            expect(tokens.get(4).type).toEqual(TokenType.OPERATOR);
            expect(tokens.get(4).value).toEqual(Operator.MULTIPLY);

            expect(tokens.get(5).type).toEqual(TokenType.OPERATOR);
            expect(tokens.get(5).value).toEqual(Operator.NOT_EQUAL);
        });

        it('should separate numbers from operations', () =>
        {
            const tokens = lexer.tokenize(CODE.NUMBERS);
            expect(tokens.size).toEqual(6);

            expect(tokens.get(0).type).toEqual(TokenType.NUMBER);
            expect(tokens.get(0).value).toEqual('-12');

            expect(tokens.get(1).type).toEqual(TokenType.OPERATOR);
            expect(tokens.get(1).value).toEqual(Operator.SUBTRACT);

            expect(tokens.get(2).type).toEqual(TokenType.NUMBER);
            expect(tokens.get(2).value).toEqual('10');

            expect(tokens.get(3).type).toEqual(TokenType.NUMBER);
            expect(tokens.get(3).value).toEqual('12_345_678.90');

            expect(tokens.get(4).type).toEqual(TokenType.NUMBER);
            expect(tokens.get(4).value).toEqual('0x124_a4Bc');

            expect(tokens.get(5).type).toEqual(TokenType.NUMBER);
            expect(tokens.get(5).value).toEqual('0b11_0110');
        });

        it('should separate keywords from literals', () =>
        {
            const tokens = lexer.tokenize(CODE.LITERALS);
            expect(tokens.size).toEqual(3);

            expect(tokens.get(0).type).toEqual(TokenType.LITERAL);
            expect(tokens.get(0).value).toEqual('`foo\\`ter`');

            expect(tokens.get(1).type).toEqual(TokenType.LITERAL);
            expect(tokens.get(1).value).toEqual('"bar\\"becue"');

            expect(tokens.get(2).type).toEqual(TokenType.LITERAL);
            expect(tokens.get(2).value).toEqual("'baz'");
        });

        it('should separate keywords from identifiers', () =>
        {
            const tokens = lexer.tokenize(CODE.KEYWORDS_IDENTIFIERS);
            expect(tokens.size).toEqual(4);

            expect(tokens.get(0).type).toEqual(TokenType.KEYWORD);
            expect(tokens.get(0).value).toEqual('class');

            expect(tokens.get(1).type).toEqual(TokenType.IDENTIFIER);
            expect(tokens.get(1).value).toEqual('Foo');

            expect(tokens.get(2).type).toEqual(TokenType.KEYWORD);
            expect(tokens.get(2).value).toEqual('function');

            expect(tokens.get(3).type).toEqual(TokenType.IDENTIFIER);
            expect(tokens.get(3).value).toEqual('bar');
        });

        it('should tokenize a code statement', () =>
        {
            const tokens = lexer.tokenize(CODE.STATEMENT);
            expect(tokens.size).toEqual(17);

            expect(tokens.get(0).type).toEqual(TokenType.KEYWORD);
            expect(tokens.get(0).value).toEqual('const');

            expect(tokens.get(1).type).toEqual(TokenType.IDENTIFIER);
            expect(tokens.get(1).value).toEqual('identifier');

            expect(tokens.get(2).type).toEqual(TokenType.OPERATOR);
            expect(tokens.get(2).value).toEqual(Operator.ASSIGN);

            expect(tokens.get(3).type).toEqual(TokenType.GROUP);
            expect(tokens.get(3).value).toEqual(Group.OPEN);

            expect(tokens.get(4).type).toEqual(TokenType.NUMBER);
            expect(tokens.get(4).value).toEqual('12');

            expect(tokens.get(5).type).toEqual(TokenType.OPERATOR);
            expect(tokens.get(5).value).toEqual(Operator.GREATER_EQUAL);

            expect(tokens.get(6).type).toEqual(TokenType.NUMBER);
            expect(tokens.get(6).value).toEqual('3');

            expect(tokens.get(7).type).toEqual(TokenType.GROUP);
            expect(tokens.get(7).value).toEqual(Group.CLOSE);

            expect(tokens.get(8).type).toEqual(TokenType.OPERATOR);
            expect(tokens.get(8).value).toEqual(Operator.TERNARY);

            expect(tokens.get(9).type).toEqual(TokenType.SCOPE);
            expect(tokens.get(9).value).toEqual(Scope.OPEN);

            expect(tokens.get(10).type).toEqual(TokenType.LITERAL);
            expect(tokens.get(10).value).toEqual("'foo'");

            expect(tokens.get(11).type).toEqual(TokenType.SCOPE);
            expect(tokens.get(11).value).toEqual(Scope.CLOSE);

            expect(tokens.get(12).type).toEqual(TokenType.DIVIDER);
            expect(tokens.get(12).value).toEqual(Divider.SCOPE);

            expect(tokens.get(13).type).toEqual(TokenType.LIST);
            expect(tokens.get(13).value).toEqual(List.OPEN);

            expect(tokens.get(14).type).toEqual(TokenType.LITERAL);
            expect(tokens.get(14).value).toEqual('"bar"');

            expect(tokens.get(15).type).toEqual(TokenType.LIST);
            expect(tokens.get(15).value).toEqual(List.CLOSE);

            expect(tokens.get(16).type).toEqual(TokenType.DIVIDER);
            expect(tokens.get(16).value).toEqual(Divider.TERMINATOR);
        });

        it('should tokenize a regex statement', () =>
        {
            const tokens = lexer.tokenize(CODE.REGEX_STATEMENT);
            expect(tokens.size).toEqual(9);

            expect(tokens.get(0).type).toEqual(TokenType.KEYWORD);
            expect(tokens.get(0).value).toEqual(Keyword.CONST);

            expect(tokens.get(1).type).toEqual(TokenType.IDENTIFIER);
            expect(tokens.get(1).value).toEqual('regex');

            expect(tokens.get(2).type).toEqual(TokenType.OPERATOR);
            expect(tokens.get(2).value).toEqual(Operator.ASSIGN);

            expect(tokens.get(3).type).toEqual(TokenType.REGEX);
            expect(tokens.get(3).value).toEqual(`/[\\"]['"]/g`);

            expect(tokens.get(4).type).toEqual(TokenType.OPERATOR);
            expect(tokens.get(4).value).toEqual(Operator.CHAINING);

            expect(tokens.get(5).type).toEqual(TokenType.IDENTIFIER);
            expect(tokens.get(5).value).toEqual('test');

            expect(tokens.get(6).type).toEqual(TokenType.GROUP);
            expect(tokens.get(6).value).toEqual(Group.OPEN);

            expect(tokens.get(7).type).toEqual(TokenType.LITERAL);
            expect(tokens.get(7).value).toEqual("'foo'");

            expect(tokens.get(8).type).toEqual(TokenType.GROUP);
            expect(tokens.get(8).value).toEqual(Group.CLOSE);
        });

        it('should tokenize a regex array', () =>
        {
            const tokens = lexer.tokenize(CODE.REGEX_ARRAY);
            expect(tokens.size).toEqual(5);

            expect(tokens.get(0).type).toEqual(TokenType.LIST);
            expect(tokens.get(0).value).toEqual(List.OPEN);

            expect(tokens.get(1).type).toEqual(TokenType.REGEX);
            expect(tokens.get(1).value).toEqual(`/[\\"]['"]/g`);

            expect(tokens.get(2).type).toEqual(TokenType.DIVIDER);
            expect(tokens.get(2).value).toEqual(Divider.SEPARATOR);

            expect(tokens.get(3).type).toEqual(TokenType.REGEX);
            expect(tokens.get(3).value).toEqual(`/Windows (?:NT|Phone) ([0-9.]+)/`);

            expect(tokens.get(4).type).toEqual(TokenType.LIST);
            expect(tokens.get(4).value).toEqual(List.CLOSE);
        });

        it('should tokenize a regex object', () =>
        {
            const tokens = lexer.tokenize(CODE.REGEX_OBJECT);
            expect(tokens.size).toEqual(5);

            expect(tokens.get(0).type).toEqual(TokenType.SCOPE);
            expect(tokens.get(0).value).toEqual(Scope.OPEN);

            expect(tokens.get(1).type).toEqual(TokenType.IDENTIFIER);
            expect(tokens.get(1).value).toEqual('test');

            expect(tokens.get(2).type).toEqual(TokenType.DIVIDER);
            expect(tokens.get(2).value).toEqual(Divider.SCOPE);

            expect(tokens.get(3).type).toEqual(TokenType.REGEX);
            expect(tokens.get(3).value).toEqual(`/[\\"]['"]/g`);

            expect(tokens.get(4).type).toEqual(TokenType.SCOPE);
            expect(tokens.get(4).value).toEqual(Scope.CLOSE);
        });

        it('should tokenize a regex result', () =>
        {
            const tokens = lexer.tokenize(CODE.REGEX_RESULT);
            expect(tokens.size).toEqual(3);

            expect(tokens.get(0).type).toEqual(TokenType.KEYWORD);
            expect(tokens.get(0).value).toEqual(Keyword.RETURN);

            expect(tokens.get(1).type).toEqual(TokenType.REGEX);
            expect(tokens.get(1).value).toEqual(`/[\\"]['"]/g`);

            expect(tokens.get(2).type).toEqual(TokenType.DIVIDER);
            expect(tokens.get(2).value).toEqual(Divider.TERMINATOR);
        });

        it('should tokenize a regex argument', () =>
        {
            const tokens = lexer.tokenize(CODE.REGEX_ARGUMENT);
            expect(tokens.size).toEqual(4);

            expect(tokens.get(0).type).toEqual(TokenType.IDENTIFIER);
            expect(tokens.get(0).value).toEqual('doSomething');

            expect(tokens.get(1).type).toEqual(TokenType.GROUP);
            expect(tokens.get(1).value).toEqual(Group.OPEN);

            expect(tokens.get(2).type).toEqual(TokenType.REGEX);
            expect(tokens.get(2).value).toEqual(`/[\\"]['"]/g`);

            expect(tokens.get(3).type).toEqual(TokenType.GROUP);
            expect(tokens.get(3).value).toEqual(Group.CLOSE);
        });

        it('should tokenize minified code', () =>
        {
            const tokens = lexer.tokenize(CODE.MINIFIED);
            expect(tokens.size).toEqual(6);

            expect(tokens.get(0).type).toEqual(TokenType.KEYWORD);
            expect(tokens.get(0).value).toEqual(Keyword.RETURN);

            expect(tokens.get(1).type).toEqual(TokenType.LITERAL);
            expect(tokens.get(1).value).toEqual('`foo`');

            expect(tokens.get(2).type).toEqual(TokenType.DIVIDER);
            expect(tokens.get(2).value).toEqual(Divider.TERMINATOR);

            expect(tokens.get(3).type).toEqual(TokenType.IDENTIFIER);
            expect(tokens.get(3).value).toEqual('identifier1');

            expect(tokens.get(4).type).toEqual(TokenType.OPERATOR);
            expect(tokens.get(4).value).toEqual(Operator.ASSIGN);

            expect(tokens.get(5).type).toEqual(TokenType.IDENTIFIER);
            expect(tokens.get(5).value).toEqual('identifier2');
        });
    });
});
