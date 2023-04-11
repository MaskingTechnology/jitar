
import ItemList from './ItemList.js';

export default class CharList extends ItemList<string>
{
    constructor(code: string)
    {
        super(code.split(''));
    }
}
