
//import { Controller, Get } from 'npm:@overnightjs/core@^1.7.6';
import { Application, Request, Response } from 'npm:@types/express@^4.17.13';
import { Logger } from 'npm:tslog@^3.3.3';

import { LocalGateway, LocalNode, Proxy } from 'npm:jitar@^0.2.0';

//@Controller('procedures')
export default class ProceduresController
{
    #runtime: LocalGateway | LocalNode | Proxy;
    #logger: Logger;

    constructor(app: Application, runtime: LocalGateway | LocalNode | Proxy, logger: Logger)
    {
        this.#runtime = runtime;
        this.#logger = logger;

        app.get('/procedures', (request: Request, response: Response) => { this.#getProcedureNames(request, response) });
    }

    //@Get()
    async #getProcedureNames(request: Request, response: Response): Promise<Response>
    {
        const names = this.#runtime.getProcedureNames();

        this.#logger.info('Got procedure names');

        return response.status(200).send(names);
    }
}
