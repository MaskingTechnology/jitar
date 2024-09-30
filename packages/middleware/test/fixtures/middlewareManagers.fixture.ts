
import MiddlewareManager from '../../src/middlewareManager';

import { MIDDLEWARES } from './middlewares.fixture';

const manager = new MiddlewareManager();
manager.addMiddleware(MIDDLEWARES.FIRST);
manager.addMiddleware(MIDDLEWARES.SECOND);
manager.addMiddleware(MIDDLEWARES.THIRD);

export const MIDDLEWARE_MANAGERS =
{
    DEFAULT: manager
};
