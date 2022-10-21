
import Module from '../../../../src/core/types/Module';

const string = 'Hello World';

const pojo = { a: 10, b: 20 }

function realFunction(a: number, b: number): number
{
    return a + b;
}

class realClass {}

const theModule: Module = {};
theModule.string = string;
theModule.pojo = pojo;
theModule.realFunction = realFunction;
theModule.realClass = realClass;

export {
    theModule,
    pojo,
    realFunction,
    realClass
}
