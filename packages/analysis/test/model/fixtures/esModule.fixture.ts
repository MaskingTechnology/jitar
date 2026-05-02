
import { ESImport, ESModuleMember, ESVariable, ESIdentifierBinding, ESExpression, ESFunction, ESGeneratorFunction, ESParameter, ESBlock, ESClass, ESExport, ESModule } from '../../../src/model';

const members =
[
    new ESImport([new ESModuleMember('default', 'Person')], './Person.js'),
    new ESVariable('const', new ESIdentifierBinding('peter'), new ESExpression('new Person("Peter")')),
    new ESVariable('const', new ESIdentifierBinding('bas'), new ESExpression('new Person("Bas")')),
    new ESFunction('createJohn', [], new ESBlock('{ return new Person("John"); }')),
    new ESFunction('sum', [new ESParameter(new ESIdentifierBinding('a'), undefined), new ESParameter(new ESIdentifierBinding('b'), undefined)], new ESBlock('{ return a + b; }')),
    new ESGeneratorFunction('generateNumbers', [new ESParameter(new ESIdentifierBinding('count'), undefined)], new ESBlock('{ for (let i = 0; i < count; i++) yield i; }')),
    new ESClass('Customer', 'Person', []),
    new ESClass('Order', undefined, []),
    new ESExport([
        new ESModuleMember('sum', 'default'),
        new ESModuleMember('peter'),
        new ESModuleMember('Customer'),
        new ESModuleMember('generateNumbers')
    ], undefined)
];

export const esModule = new ESModule(members);
