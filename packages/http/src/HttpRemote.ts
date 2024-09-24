
import { ErrorConverter, Request, Response as ResultResponse } from '@jitar/execution';
import { Remote } from '@jitar/services';
import { File } from '@jitar/sourcing';

import HeaderKeys from './definitions/HeaderKeys';
import HeaderValues from './definitions/HeaderValues';

const errorConverter = new ErrorConverter();

export default class HttpRemote implements Remote
{
    #url: string;

    constructor(url: string)
    {
        this.#url = url;
    }

    connect(): Promise<void>
    {
        return Promise.resolve();
    }

    disconnect(): Promise<void>
    {
        return Promise.resolve();
    }

    async provide(filename: string): Promise<File>
    {
        const remoteUrl = `${this.#url}/${filename}`;
        const options = { method: 'GET' };

        const response = await this.#callRemote(remoteUrl, options);
        const type = response.headers.get(HeaderKeys.CONTENT_TYPE) ?? HeaderValues.APPLICATION_STREAM;
        const result = await response.arrayBuffer();
        const content = Buffer.from(result);

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
        const body = { url, procedureNames, trustKey };
        const options =
        {
            method: 'POST',
            headers: { 'Content-Type': HeaderValues.APPLICATION_JSON },
            body: JSON.stringify(body)
        };

        await this.#callRemote(remoteUrl, options);
    }

    async run(request: Request): Promise<ResultResponse>
    {
        request.setHeader(HeaderKeys.CONTENT_TYPE, HeaderValues.APPLICATION_JSON);

        const versionString = request.version.toString();
        const argsObject = Object.fromEntries(request.args);
        const headersObject = Object.fromEntries(request.headers);

        const remoteUrl = `${this.#url}/rpc/${request.fqn}?version=${versionString}`;
        const body = await this.#createRequestBody(argsObject);
        const options =
        {
            method: 'POST',
            redirect: 'manual',
            headers: headersObject,
            body: body
        };

        const response = await this.#callRemote(remoteUrl, options, false);
        const status = response.status;

        const result = await this.#getResponseResult(response);
        const headers = this.#createResponseHeaders(response);

        return new ResultResponse(status, result, headers);
    }

    async #callRemote(remoteUrl: string, options: object, throwOnError = true): Promise<Response>
    {
        const response = await fetch(remoteUrl, options);

        if (throwOnError && this.#isErrorResponse(response))
        {
            const result = await this.#getResponseResult(response);

            throw errorConverter.fromStatus(response.status, String(result));
        }

        return response;
    }

    #isErrorResponse(response: Response): boolean
    {
        return response.status < 200 || response.status > 399;
    }

    async #createRequestBody(body: unknown): Promise<string>
    {
        return JSON.stringify(body);
    }

    async #getResponseResult(response: Response): Promise<unknown>
    {
        const contentType = response.headers.get(HeaderKeys.JITAR_CONTENT_TYPE)
                         ?? response.headers.get(HeaderKeys.CONTENT_TYPE);

        if (contentType?.includes('undefined'))
        {
            return undefined;
        }

        if (contentType?.includes('null'))
        {
            return null;
        }

        if (contentType?.includes('json'))
        {
            return response.json();
        }

        const content = await response.text();

        if (contentType?.includes('boolean'))
        {
            return content === 'true';
        }

        if (contentType?.includes('number'))
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
