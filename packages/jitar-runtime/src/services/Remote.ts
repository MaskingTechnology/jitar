
import { Serializer, SerializerBuilder } from 'jitar-serialization';

import File from '../models/File.js';
import Version from '../models/Version.js';
import Module from '../types/Module.js';
import ModuleLoader from '../utils/ModuleLoader.js';

import Node from './Node.js';

export default class Remote
{
    #url: string;
    #useSerializer: boolean;
    #serializer: Serializer;

    constructor(url: string, useSerializer: boolean, serializer: Serializer = SerializerBuilder.build())
    {
        this.#url = url;
        this.#useSerializer = useSerializer;
        this.#serializer = serializer;
    }

    async registerClient(segmentFiles: string[]): Promise<string>
    {
        const url = `${this.#url}/modules`;
        const options =
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(segmentFiles)
        };

        const response = await this.#callRemote(url, options, 200);
        const clientId = await response.text();

        return clientId;
    }

    async loadFile(filename: string): Promise<File>
    {
        const url = `${this.#url}/${filename}`;
        const options = { method: 'GET' };

        const response = await this.#callRemote(url, options, 200);
        const type = response.headers.get('Content-Type') || 'application/octet-stream';
        const content = await response.text();

        return new File(filename, type, content);
    }

    async importFile(filename: string): Promise<Module>
    {
        const url = `${this.#url}/${filename}`;

        return ModuleLoader.load(url);
    }

    async isHealthy(): Promise<boolean>
    {
        const url = `${this.#url}/health/status`;
        const options = { method: 'GET' };

        const response = await this.#callRemote(url, options, 200);
        const healthy = await response.text();

        return Boolean(healthy);
    }

    async getHealth(): Promise<Map<string, boolean>>
    {
        const url = `${this.#url}/health`;
        const options = { method: 'GET' };

        const response = await this.#callRemote(url, options, 200);
        const health = await response.json();

        return new Map(Object.entries(health));
    }

    async addNode(node: Node): Promise<void>
    {
        const url = `${this.#url}/nodes`;
        const body =
        {
            url: node.url,
            procedureNames: node.getProcedureNames()
        }
        const options =
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        }

        await this.#callRemote(url, options, 201);
    }

    async run(fqn: string, version: Version, args: Map<string, unknown>, headers: Map<string, string>): Promise<unknown>
    {
        headers.set('content-type', 'application/json');
        
        const versionString = version.toString();
        const argsObject = Object.fromEntries(args);
        const headersObject = Object.fromEntries(headers);

        const url = `${this.#url}/rpc/${fqn}?version=${versionString}&serialize=true`;
        const body = await this.#createRequestBody(argsObject, this.#useSerializer);
        const options =
        {
            method: 'POST',
            headers: headersObject,
            body: body
        };

        const response = await this.#callRemote(url, options, 200);

        return this.#createResponseResult(response, this.#useSerializer);
    }

    async #callRemote(url: string, options: object, expectedStatus: number): Promise<Response>
    {
        const response = await fetch(url, options);

        if (response.status !== expectedStatus)
        {
            const error = await this.#createResponseResult(response, true);

            throw error;
        }

        return response;
    }

    async #createRequestBody(body: unknown, serialize: boolean): Promise<string>
    {
        const data = serialize
            ? await this.#serializer.serialize(body)
            : body;

        return JSON.stringify(data);
    }

    async #createResponseResult(response: Response, serialize: boolean): Promise<unknown>
    {
        const result = await this.#getResponseResult(response);

        return serialize
            ? this.#serializer.deserialize(result)
            : result;
    }

    async #getResponseResult(response: Response): Promise<unknown>
    {
        const contentType = response.headers.get('Content-Type');

        if (contentType !== null && contentType.includes('json'))
        {
            return response.json();
        }

        return response.text();
    }
}
