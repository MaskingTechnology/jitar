
export type FieldValidation = PrimitiveValidation | GroupValidation | ListValidation | EnumValidation;

type BaseValidation =
{
    required: boolean;
}

export type PrimitiveValidation = BaseValidation &
{
    type: 'string' | 'integer' | 'real' | 'boolean' | 'url';
};

export type GroupValidation = BaseValidation &
{
    type: 'group';
    fields: Record<string, FieldValidation>;
}

export type ListValidation = BaseValidation &
{
    type: 'list';
    items: PrimitiveValidation;
};

export type EnumValidation = BaseValidation &
{
    type: 'enum';
    options: unknown[];
};

type ValidationScheme = Record<string, FieldValidation>;

export default ValidationScheme;
