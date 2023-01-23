
import Component from '../types/Component.js'
import BadRequest from './BadRequest.js'

export default class UnknownParameter extends BadRequest
{
    constructor(parameterName: string)
    {
        super(`Unknown parameter ${parameterName}`)
    }
}

(UnknownParameter as Component).source = '/jitar/core/errors/UnknownParameter.js'
