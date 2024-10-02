
import type Request from '../models/Request';
import type Response from '../models/Response';

interface Runner
{
    run(request: Request): Promise<Response>;
}

export default Runner;
