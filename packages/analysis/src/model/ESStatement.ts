
export default abstract class ESStatement
{
    abstract clone(): ESStatement;
    
    abstract toString(terminate: boolean): string;
}
