
import ItemList from '../../../src/parser/ItemList';

const items: string[] =
[
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j"
];

function createList(): ItemList<string>
{
    return new ItemList(items);
}

export { createList };
