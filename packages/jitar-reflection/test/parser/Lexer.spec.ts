
import { Divider } from '../../src/parser/definitions/Divider';
import { Group } from '../../src/parser/definitions/Group';
import { List } from '../../src/parser/definitions/List';
import { Operator } from '../../src/parser/definitions/Operator';
import { Scope } from '../../src/parser/definitions/Scope';
import { TokenType } from '../../src/parser/definitions/TokenType';
import Lexer from '../../src/parser/Lexer';

import { code } from '../_fixtures/parser/Lexer.fixture';

const lexer = new Lexer();

describe('parser/Lexer', () =>
{
    describe('.tokenize(code, ignoreComments)', () =>
    {
        it('should tokenize a code string', () =>
        {
            const tokens = lexer.tokenize(code);
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
    });
});
