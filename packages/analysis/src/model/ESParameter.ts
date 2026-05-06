
import ESBindingElement from './ESBindingElement';

export default class ESParameter extends ESBindingElement
{
    clone(): ESParameter
    {
        return super.clone() as ESParameter;
    }
}
