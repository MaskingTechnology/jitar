
import { ErrorConverter, Request, Response as ResultResponse } from '@jitar/execution';
import { AddWorkerRequest } from '@jitar/runtime';
import type { Remote } from '@jitar/services';
import { File } from '@jitar/sourcing';
import { Validator } from '@jitar/validation';

import HeaderKeys from './definitions/HeaderKeys';
import HeaderValues from './definitions/HeaderValues';
import InvalidWorkerId from './errors/InvalidWorkerId';
import type HttpClient from './interfaces/HttpClient';

export default class HttpRemote implements Remote
{
    readonly #url: string;
    readonly #httpClient: HttpClient;
    
    readonly #errorConverter = new ErrorConverter();
    readonly #validator = new Validator();

    constructor(url: string, httpClient: HttpClient)
    {
        this.#url = url;
        this.#httpClient = httpClient;
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

        return healthy === 'true';
    }

    async getHealth(): Promise<Map<string, boolean>>
    {
        const remoteUrl = `${this.#url}/health`;
        const options = { method: 'GET' };

        const response = await this.#callRemote(remoteUrl, options);
        const health = await response.json();

        return new Map(Object.entries(health));
    }

    async addWorker(url: string, procedureNames: string[], trustKey?: string): Promise<string>
    {
        const remoteUrl = `${this.#url}/workers`;
        const body: AddWorkerRequest = { url, procedureNames, trustKey };
        const options =
        {
            method: 'POST',
            headers: { 'Content-Type': HeaderValues.APPLICATION_JSON },
            body: JSON.stringify(body)
        };

        const response = await this.#callRemote(remoteUrl, options);

        const contentType = response.headers.get(HeaderKeys.CONTENT_TYPE);

        if (contentType === null || contentType.includes(HeaderValues.APPLICATION_JSON) === false)
        {
            throw new InvalidWorkerId();
        }

        const result = await response.json();

        const validation = this.#validator.validate(result,
        {
            id: { type: 'string', required: true }
        });

        if (validation.valid === false)
        {
            throw new InvalidWorkerId();
        }

        return result.id;
    }

    async removeWorker(id: string): Promise<void>
    {
        const remoteUrl = `${this.#url}/workers/${id}`;
        const options =
        {
            method: 'DELETE',
            headers: { 'Content-Type': HeaderValues.APPLICATION_JSON }
        };

        await this.#callRemote(remoteUrl, options);
    }

    async run(request: Request): Promise<ResultResponse>
    {
        request.setHeader(HeaderKeys.CONTENT_TYPE, HeaderValues.APPLICATION_JSON);

        const argsObject = Object.fromEntries(request.args);
        const headersObject = Object.fromEntries(request.headers);

        const versionString = request.version.toString();
        headersObject[HeaderKeys.JITAR_PROCEDURE_VERSION] = versionString;

        const remoteUrl = `${this.#url}/rpc/${request.fqn}`;
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
        const response = await this.#httpClient.execute(remoteUrl, options);

        if (throwOnError && this.#isErrorResponse(response))
        {
            const result = await this.#getResponseResult(response);

            throw this.#errorConverter.fromStatus(response.status, String(result));
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
