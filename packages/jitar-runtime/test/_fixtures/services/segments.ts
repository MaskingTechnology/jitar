
import { AccessLevel } from '../../../src/definitions/AccessLevel';
import Procedure from '../../../src/models/Procedure';
import Implementation from '../../../src/models/Implementation';
import Version from '../../../src/models/Version';
import Segment from '../../../src/models/Segment';

import { runProcedure } from '../../../src/hooks';

function firstPrivateTask()
{
    return 'first';
}

// Runs a private task on the same segment
function firstPublicTask()
{
    return runProcedure('my/module/firstPrivateTask', '0.0.0', new Map());
}

// Runs a public task on another segment
function thirdPublicTask()
{
    return runProcedure('my/module/fourthPublicTask', '0.0.0', new Map());
}

function fourthPublicTask()
{
    return 'fourth';
}

function secondPrivateTask()
{
    return 'second';
}

// Runs a private task on another segment
function secondPublicTask()
{
    return runProcedure('my/module/firstPrivateTask', '0.0.0', new Map());
}

const firstImplementation = new Implementation(Version.DEFAULT, AccessLevel.PRIVATE, [], firstPrivateTask);
const secondImplementation = new Implementation(Version.DEFAULT, AccessLevel.PUBLIC, [], firstPublicTask);
const thirdImplementation = new Implementation(Version.DEFAULT, AccessLevel.PUBLIC, [], thirdPublicTask);
const fourthImplementation = new Implementation(Version.DEFAULT, AccessLevel.PUBLIC, [], fourthPublicTask);
const fifthImplementation = new Implementation(Version.DEFAULT, AccessLevel.PRIVATE, [], secondPrivateTask);
const sixthImplementation = new Implementation(Version.DEFAULT, AccessLevel.PUBLIC, [], secondPublicTask);

const firstProcedure = new Procedure('my/module/firstPrivateTask');
firstProcedure.addImplementation(firstImplementation);

const secondProcedure = new Procedure('my/module/firstPublicTask');
secondProcedure.addImplementation(secondImplementation);

const thirdProcedure = new Procedure('my/module/thirdPublicTask');
thirdProcedure.addImplementation(thirdImplementation);

const fourthProcedure = new Procedure('my/module/fourthPublicTask');
fourthProcedure.addImplementation(fourthImplementation);

const fifthProcedure = new Procedure('my/module/secondPrivateTask');
fifthProcedure.addImplementation(fifthImplementation);

const sixthProcedure = new Procedure('my/module/secondPublicTask');
sixthProcedure.addImplementation(sixthImplementation);

const firstSegment = new Segment('first');
firstSegment.addProcedure(firstProcedure);
firstSegment.addProcedure(secondProcedure);
firstSegment.addProcedure(thirdProcedure);

const secondSegment = new Segment('second');
secondSegment.addProcedure(fourthProcedure);
secondSegment.addProcedure(fifthProcedure);
secondSegment.addProcedure(sixthProcedure);

export { firstSegment, secondSegment }
