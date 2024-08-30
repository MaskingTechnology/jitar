
import type Request from '../models/Request.js';
import type Response from '../models/Response.js';

interface Runner
{
    run(request: Request): Promise<Response>;

    // TODO: Add dryRun() method
}

export default Runner;
