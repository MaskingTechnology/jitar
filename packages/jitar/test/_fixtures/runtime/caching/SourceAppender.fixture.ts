
import ApplicationModule from '../../../../src/runtime/caching/models/ApplicationModule';

class AClass {}
class BClass {}
class CClass {}
class DClass {}

const classes: Map<string, Function> = new Map();
classes.set('AClass', AClass);
classes.set('BClass', BClass);
classes.set('AliasClass', CClass); // Aliasses should be ignored
classes.set('AnonymousClass', class {}) // Anonymous classes should be ignored
classes.set('default', DClass); // Defaults should be accepted

const applicationModule = new ApplicationModule('app/module.js', classes, new Map());
const filecode = '/* code */';
const filename = 'app/core/classes.js';

const codeResult =
    `/* code */
AClass.source = 'app/core/classes.js';
BClass.source = 'app/core/classes.js';
DClass.source = 'app/core/classes.js';`;

const emptyModule = new ApplicationModule('app/module.js', new Map(), new Map());

export
{
    applicationModule,
    emptyModule,
    filecode,
    filename,
    codeResult
}
