
import { Request, Response as ResultResponse } from '@jitar/execution';
import { File } from '@jitar/sourcing';

const APPLICATION_JSON = 'application/json';

export default class Remote
{
    #url: string;

    constructor(url: string)
    {
        this.#url = url;
    }

    async loadFile(filename: string): Promise<File>
    {
        const remoteUrl = `${this.#url}/${filename}`;
        const options = { method: 'GET' };

        const response = await this.#callRemote(remoteUrl, options);
        const type = response.headers.get('Content-Type') || 'application/octet-stream';
        const content = await response.text();

        return new File(filename, type, content);
    }

    async isHealthy(): Promise<boolean>
    {
        const remoteUrl = `${this.#url}/health/status`;
        const options = { method: 'GET' };

        const response = await this.#callRemote(remoteUrl, options);
        const healthy = await response.text();

        return Boolean(healthy);
    }

    async getHealth(): Promise<Map<string, boolean>>
    {
        const remoteUrl = `${this.#url}/health`;
        const options = { method: 'GET' };

        const response = await this.#callRemote(remoteUrl, options);
        const health = await response.json();

        return new Map(Object.entries(health));
    }

    async addWorker(url: string, procedureNames: string[], trustKey?: string): Promise<void>
    {
        const remoteUrl = `${this.#url}/workers`;
        const body = { url, procedureNames, trustKey};
        const options =
        {
            method: 'POST',
            headers: { 'Content-Type': APPLICATION_JSON },
            body: JSON.stringify(body)
        };

        await this.#callRemote(remoteUrl, options);
    }

    async run(request: Request): Promise<ResultResponse>
    {
        request.setHeader('content-type', APPLICATION_JSON);

        const versionString = request.version.toString();
        const argsObject = Object.fromEntries(request.args);
        const headersObject = Object.fromEntries(request.headers);

        const url = `${this.#url}/rpc/${request.fqn}?version=${versionString}`;
        const body = await this.#createRequestBody(argsObject);
        const options =
        {
            method: 'POST',
            headers: headersObject,
            body: body
        };

        const response = await fetch(url, options);
        const success = this.#isSuccessResponse(response);
        const result = await this.#getResponseResult(response);
        const headers = this.#createResponseHeaders(response);

        return new ResultResponse(success, result, headers);
    }

    async #callRemote(url: string, options: object): Promise<Response>
    {
        const response = await fetch(url, options);

        if (this.#isErrorResponse(response))
        {
            const message = await this.#getResponseResult(response);

            // TODO: make specific error
            throw new Error(String(message));
        }

        return response;
    }

    #isSuccessResponse(response: Response): boolean
    {
        return response.status >= 200 && response.status < 300;
    }

    #isErrorResponse(response: Response): boolean
    {
        return response.status < 200 || response.status > 299;
    }

    async #createRequestBody(body: unknown): Promise<string>
    {
        return JSON.stringify(body);
    }

    async #getResponseResult(response: Response): Promise<unknown>
    {
        const contentType = response.headers.get('Content-Type');

        if (contentType !== null && contentType.includes('json'))
        {
            return response.json();
        }

        const content = await response.text();

        if (contentType !== null && contentType.includes('boolean'))
        {
            return content === 'true';
        }

        if (contentType !== null && contentType.includes('number'))
        {
            return Number(content);
        }

        return content;
    }

    #createResponseHeaders(response: Response): Map<string, string>
    {
        const headers = new Map();

        for (const [name, value] of response.headers)
        {
            headers.set(name, value);
        }

        return headers;
    }
}
