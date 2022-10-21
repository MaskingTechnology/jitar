
import Procedure from '../../../src/core/Procedure';
import * as AccessLevel from '../../../src/core/definitions/AccessLevel';
import Implementation from '../../../src/core/Implementation';
import Version from '../../../src/core/Version';

function v1_0_0(): string { return '1.0.0'; }
function v1_0_5(): string { return '1.0.5'; }
function v1_1_0(): string { return '1.1.0'; }

const v100Implementation = new Implementation(new Version(1, 0, 0), AccessLevel.PRIVATE, [], v1_0_0);
const v105Implementation = new Implementation(new Version(1, 0, 5), AccessLevel.PUBLIC, [], v1_0_5);
const v110Implementation = new Implementation(new Version(1, 1, 0), AccessLevel.PUBLIC, [], v1_1_0);

const rootProcedure = new Procedure('', 'myRootProcedure');
rootProcedure.addImplementation(v100Implementation);
rootProcedure.addImplementation(v105Implementation);
rootProcedure.addImplementation(v110Implementation);

const moduleProcedure = new Procedure('my/module', 'myModuleProcedure');
moduleProcedure.addImplementation(v100Implementation);
moduleProcedure.addImplementation(v105Implementation);
moduleProcedure.addImplementation(v110Implementation);

const privateProcedure = new Procedure('my/module', 'myPrivateProcedure');
privateProcedure.addImplementation(v100Implementation);

export
{
    rootProcedure,
    moduleProcedure,
    privateProcedure
}
