
import {
    Segment,
    Class,
    ImplementationNotFound,
    InvalidParameterValue,
    InvalidVersionNumber,
    MissingParameterValue,
    ProcedureNotFound,
    UnknownParameter
    
} from '@jitar/execution';

const segment = new Segment('@jitar');

const implementationNotFound = new Class('@jitar/execution/ImplementationNotFound', ImplementationNotFound);
const invalidParameterValue = new Class('@jitar/execution/InvalidParameterValue', InvalidParameterValue);
const invalidVersionNumber = new Class('@jitar/execution/InvalidVersionNumber', InvalidVersionNumber);
const missingParameterValue = new Class('@jitar/execution/MissingParameterValue', MissingParameterValue);
const procedureNotFound = new Class('@jitar/execution/ProcedureNotFound', ProcedureNotFound);
const unknownParameter = new Class('@jitar/execution/UnknownParameter', UnknownParameter);

segment.addClass(implementationNotFound);
segment.addClass(invalidParameterValue);
segment.addClass(invalidVersionNumber);
segment.addClass(missingParameterValue);
segment.addClass(procedureNotFound);
segment.addClass(unknownParameter);

export default segment;
