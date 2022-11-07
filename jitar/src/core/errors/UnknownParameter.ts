
import Component from '../types/Component.js'

export default class UnknownParameter extends Error
{
    constructor(parameterName: string)
    {
        super(`Unknown parameter ${parameterName}`)
    }
}

(UnknownParameter as Component).source = '/jitar/core/errors/UnknownParameter.js'
