
export type FieldValidation = PrimitiveValidation | GroupValidation | ListValidation;

export type PrimitiveValidation =
{
    type: 'string' | 'integer' | 'real' | 'boolean' | 'url';
    required?: boolean;
};

export type GroupValidation = 
{
    type: 'group';
    required?: boolean;
    fields: Record<string, FieldValidation>;
}

export type ListValidation =
{
    type: 'list';
    required?: boolean;
    items: PrimitiveValidation;
};

type ValidationScheme = Record<string, FieldValidation>;

export default ValidationScheme;
