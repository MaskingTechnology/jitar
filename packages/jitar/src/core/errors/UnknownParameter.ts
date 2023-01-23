
import Component from '../types/Component.js'
import InvalidRequest from './InvalidRequest.js'

export default class UnknownParameter extends InvalidRequest
{
    constructor(parameterName: string)
    {
        super(`Unknown parameter ${parameterName}`)
    }
}

(UnknownParameter as Component).source = '/jitar/core/errors/UnknownParameter.js'
