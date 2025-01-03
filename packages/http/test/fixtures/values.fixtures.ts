
import { Request, RunModes, Version } from '@jitar/execution';

const VALUES = {
    REMOTE: {
        DUMMY: 'https://dummy.remote',
        IS_HEALTHY: 'https://is.healthy',
        IS_UNHEALTHY: 'https://is.unhealthy',
        ADD_WORKER_VALID: 'https://valid.add.worker.remote',
        ADD_WORKER_INVALID_ID: 'https://invalid.add.worker.id.remote',
        ADD_WORKER_INVALID_REQUEST: 'https://invalid.add.worker.request.remote'
    },

    URI: {
        FILE_WITH_CONTENT_TYPE: 'https://dummy.remote/index.html',
        FILE_WITH_DEFAULT_CONTENT_TYPE: 'https://dummy.remote/index.bin',
        IS_HEALTHY: 'https://is.healthy/health/status',
        IS_UNHEALTHY: 'https://is.unhealthy/health/status',
        GET_HEALTH: 'https://dummy.remote/health',
        ADD_WORKER_VALID: 'https://valid.add.worker.remote/workers',
        ADD_WORKER_INVALID_ID: 'https://invalid.add.worker.id.remote/workers',
        ADD_WORKER_INVALID_REQUEST: 'https://invalid.add.worker.request.remote/workers',
        RUN_VALID: 'https://dummy.remote/rpc/helloWorld',
        RUN_BAD_REQUEST: 'https://dummy.remote/rpc/badRequest'
    },

    INPUT: {
        FILE_WITH_CONTENT_TYPE: 'index.html',
        FILE_WITH_DEFAULT_CONTENT_TYPE: 'index.bin',
        ADD_WORKER: 'https://worker.remote',
        RUN_VALID: new Request(
            'helloWorld', 
            new Version(1, 0, 0),
            new Map([['name', 'John']]),
            new Map([['Content-Type', 'application/json']]),
            RunModes.NORMAL
        ),
        RUN_BAD_REQUEST: new Request(
            'badRequest', 
            new Version(1, 0, 0),
            new Map(),
            new Map(),
            RunModes.NORMAL
        ),
    },

    RESPONSE: {
        FILE_WITH_CONTENT_TYPE: new Response( 
            `<html></html>`,
            { status: 200, headers: { 'Content-Type': 'text/html' } }
        ),

        FILE_WITH_DEFAULT_CONTENT_TYPE: new Response(
            new ArrayBuffer(64),
            { status: 200 } 
        ),

        IS_HEALTHY: new Response(
            'true',
            { status: 200, headers: { 'Content-Type': 'text/plain' } }
        ),

        IS_UNHEALTHY: new Response(
            'false',
            { status: 200, headers: { 'Content-Type': 'text/plain' } }
        ),

        GET_HEALTH: new Response(
            '{ "database": true, "filestore": false }',
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        ),

        ADD_WORKER_VALID: new Response(
            '{ "id": "1" }',
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        ),

        ADD_WORKER_INVALID_ID: new Response(
            '{ "id": null }',
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        ),

        ADD_WORKER_INVALID_REQUEST: new Response(
            '123',
            { status: 200, headers: { 'Content-Type': 'text/plain' } }
        ),

        RUN_VALID: new Response(
            'Hello, John!',
            { status: 200 , headers: { 'Content-Type': 'text/plain' } }
        ),

        RUN_BAD_REQUEST: new Response(
            'Unknown parameter "name"',
            { status: 400, headers: { 'Content-Type': 'text/plain' } }
        )
    },

    OUTPUT: {
        FILE_WITH_CONTENT_TYPE: {
            location: 'index.html',
            type: 'text/html'
        },
        FILE_WITH_DEFAULT_CONTENT_TYPE: {
            location: 'index.bin',
            type: 'application/octet-stream'
        },
        IS_HEALTHY: true,
        IS_UNHEALTHY: false,
        GET_HEALTH: {
            database: {
                key: 'database',
                value: true
            },
            filestore: {
                key: 'filestore',
                value: false
            }
        },
        ADD_WORKER_VALID: '1',
        RUN_VALID: {
            status: 200,
            result: 'Hello, John!'
        },
        RUN_BAD_REQUEST: {
            status: 400,
            result: 'Unknown parameter "name"'
        }
    }
}

export { VALUES };
