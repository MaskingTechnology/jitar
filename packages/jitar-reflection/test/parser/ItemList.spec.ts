
import { createList } from '../_fixtures/parser/ItemList.fixture';

describe('parser/ItemList', () =>
{
    describe('.current', () =>
    {
        it('should start at the first item', () =>
        {
            const itemList = createList();

            expect(itemList.current).toBe('a');
        });

        it('should return the second item after a step', () =>
        {
            const itemList = createList();
            itemList.step();

            expect(itemList.current).toBe('b');
        });
    });

    describe('.next', () =>
    {
        it('should return the second item for a new list', () =>
        {
            const itemList = createList();

            expect(itemList.next).toBe('b');
        });

        it('should return the third item after a step', () =>
        {
            const itemList = createList();
            itemList.step();

            expect(itemList.next).toBe('c');
        });
    });

    describe('.previous', () =>
    {
        it('should return undefined for a new list', () =>
        {
            const itemList = createList();

            expect(itemList.previous).toBe(undefined);
        });

        it('should return the first item after a step', () =>
        {
            const itemList = createList();
            itemList.step();

            expect(itemList.previous).toBe('a');
        });
    });

    describe('.eol', () =>
    {
        it('should be false for a new list', () =>
        {
            const itemList = createList();

            expect(itemList.eol).toBe(false);
        });

        it('should be true for at the end of the list', () =>
        {
            const itemList = createList();
            itemList.step(10);

            expect(itemList.eol).toBe(true);
        });
    });

    describe('.notAtEnd()', () =>
    {
        it('should be true for a new list', () =>
        {
            const itemList = createList();
            const result = itemList.notAtEnd();

            expect(result).toBe(true);
        });

        it('should be false for at the end of the list', () =>
        {
            const itemList = createList();
            itemList.step(10);

            const result = itemList.notAtEnd();

            expect(result).toBe(false);
        });
    });

    describe('.step(amount)', () =>
    {
        it('should step one position without an argument', () =>
        {
            const itemList = createList();
            itemList.step();

            expect(itemList.position).toBe(1);
        });

        it('should step the given amount', () =>
        {
            const itemList = createList();
            itemList.step(5);

            expect(itemList.position).toBe(5);
        });
    });

    describe('.stepBack(amount)', () =>
    {
        it('should step back one position without an argument', () =>
        {
            const itemList = createList();
            itemList.step(5);
            itemList.stepBack();

            expect(itemList.position).toBe(4);
        });

        it('should step back the given amount', () =>
        {
            const itemList = createList();
            itemList.step(5);
            itemList.stepBack(3);

            expect(itemList.position).toBe(2);
        });
    });
});
