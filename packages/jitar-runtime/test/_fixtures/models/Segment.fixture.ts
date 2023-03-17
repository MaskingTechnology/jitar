
import { AccessLevel } from '../../../src/definitions/AccessLevel';
import Procedure from '../../../src/models/Procedure';
import Implementation from '../../../src/models/Implementation';
import Version from '../../../src/models/Version';
import Segment from '../../../src/models/Segment';

function getPrivate(): string { return 'private'; }
function getPublic(): string { return 'public'; }
function getModule(): string { return 'my/module'; }
function throwError(): void { throw new Error('broken'); }

const privateImplementation = new Implementation(Version.DEFAULT, AccessLevel.PRIVATE, [], getPrivate);
const publicImplementation = new Implementation(Version.DEFAULT, AccessLevel.PUBLIC, [], getPublic);
const moduleImplementation = new Implementation(Version.DEFAULT, AccessLevel.PRIVATE, [], getModule);
const errorImplementation = new Implementation(Version.DEFAULT, AccessLevel.PRIVATE, [], throwError);

const privateProcedure = new Procedure('getPrivate');
privateProcedure.addImplementation(privateImplementation);

const publicProcedure = new Procedure('getPublic');
publicProcedure.addImplementation(publicImplementation);

const moduleProcedure = new Procedure('my/module/getModule');
moduleProcedure.addImplementation(moduleImplementation);

const errorProcedure = new Procedure('throwError');
errorProcedure.addImplementation(errorImplementation);

const segment = new Segment('my-segment');
segment.addProcedure(privateProcedure);
segment.addProcedure(publicProcedure);
segment.addProcedure(moduleProcedure);
segment.addProcedure(errorProcedure);

export { segment }
