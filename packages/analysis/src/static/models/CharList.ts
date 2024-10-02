
import ItemList from './ItemList';

export default class CharList extends ItemList<string>
{
    constructor(code: string)
    {
        super(code.split(''));
    }
}
