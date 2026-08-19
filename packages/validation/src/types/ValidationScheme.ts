
export type FieldValidation = PrimitiveValidation | GroupValidation | ListValidation | EnumValidation;

type BaseValidation =
{
    readonly required?: boolean;
}

export type PrimitiveValidation = BaseValidation &
{
    readonly type: 'string' | 'integer' | 'real' | 'boolean' | 'url';
};

export type GroupValidation = BaseValidation &
{
    readonly type: 'group';
    readonly fields: Record<string, FieldValidation>;
}

export type ListValidation = BaseValidation &
{
    readonly type: 'list';
    readonly items: PrimitiveValidation;
};

export type EnumValidation = BaseValidation &
{
    readonly type: 'enum';
    readonly options: unknown[];
};

type ValidationScheme = Record<string, FieldValidation>;

export default ValidationScheme;
