
import Component from '../../../core/types/Component.js';

export default class InvalidPropertyType extends Error
{
    constructor(typeName: string, propertyName: string, expectedType: string)
    {
        super(`The ${typeName} property '${propertyName}' has an invalid type (expected '${expectedType}')`);
    }
}

(InvalidPropertyType as Component).source = '/jitar/runtime/serialization/errors/InvalidPropertyType.js';
