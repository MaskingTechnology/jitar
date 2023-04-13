
import { APPLICATION } from './models/Application.fixture';
import { MODULES } from './models/Module.fixture';
import { MODULE_CACHES } from './models/ModuleCache.fixture';

const INPUT =
{
    APPLICATION: APPLICATION,
    MODULE: MODULES.STORE_ORDER
};

const OUTPUT = MODULE_CACHES.STORE_ORDER;

export { INPUT, OUTPUT };
