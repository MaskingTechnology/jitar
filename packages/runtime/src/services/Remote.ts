
import { Serializer, SerializerBuilder } from '@jitar/serialization';

import File from '../models/File.js';
import Request from '../models/Request.js';
import { default as ResultResponse } from '../models/Response.js';

import RemoteClassLoader from '../utils/RemoteClassLoader.js';

import Worker from './Worker.js';

const remoteClassLoader = new RemoteClassLoader();
const defaultSerializer = SerializerBuilder.build(remoteClassLoader);

const APPLICATION_JSON = 'application/json';

export default class Remote
{
    #url: string;
    #serializer: Serializer;

    constructor(url: string, serializer: Serializer = defaultSerializer)
    {
        this.#url = url;
        this.#serializer = serializer;
    }

    async loadFile(filename: string): Promise<File>
    {
        const url = `${this.#url}/${filename}`;
        const options = { method: 'GET' };

        const response = await this.#callRemote(url, options);
        const type = response.headers.get('Content-Type') || 'application/octet-stream';
        const content = await response.text();

        return new File(filename, type, content);
    }

    async isHealthy(): Promise<boolean>
    {
        const url = `${this.#url}/health/status`;
        const options = { method: 'GET' };

        const response = await this.#callRemote(url, options);
        const healthy = await response.text();

        return Boolean(healthy);
    }

    async getHealth(): Promise<Map<string, boolean>>
    {
        const url = `${this.#url}/health`;
        const options = { method: 'GET' };

        const response = await this.#callRemote(url, options);
        const health = await response.json();

        return new Map(Object.entries(health));
    }

    async addWorker(worker: Worker): Promise<void>
    {
        const url = `${this.#url}/workers`;
        const body =
        {
            url: worker.url,
            procedureNames: worker.getProcedureNames(),
            trustKey: worker.trustKey,
        };
        const options =
        {
            method: 'POST',
            headers: { 'Content-Type': APPLICATION_JSON },
            body: JSON.stringify(body)
        };

        await this.#callRemote(url, options);
    }

    async run(request: Request): Promise<ResultResponse>
    {
        request.setHeader('content-type', APPLICATION_JSON);

        const versionString = request.version.toString();
        const argsObject = Object.fromEntries(request.args);
        const headersObject = Object.fromEntries(request.headers);

        const url = `${this.#url}/rpc/${request.fqn}?version=${versionString}&serialize=true`;
        const body = await this.#createRequestBody(argsObject);
        const options =
        {
            method: 'POST',
            headers: headersObject,
            body: body
        };

        const response = await this.#callRemote(url, options);
        const result = await this.#createResponseResult(response);
        const headers = this.#createResponseHeaders(response);

        return new ResultResponse(result, headers);
    }

    async #callRemote(url: string, options: object): Promise<Response>
    {
        const response = await fetch(url, options);

        if (this.#isErrorResponse(response))
        {
            throw await this.#createResponseResult(response);
        }

        return response;
    }

    #isErrorResponse(response: Response): boolean
    {
        return response.status < 200 || response.status > 299;
    }

    async #createRequestBody(body: unknown): Promise<string>
    {
        const data = await this.#serializer.serialize(body);
        
        return JSON.stringify(data);
    }

    async #createResponseResult(response: Response): Promise<unknown>
    {
        const result = await this.#getResponseResult(response);

        return this.#serializer.deserialize(result);
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
