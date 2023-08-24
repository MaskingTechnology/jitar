
import Request from '../models/Request.js';

interface Runner
{
    run(request: Request): Promise<unknown>;
}

export default Runner;
