
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const filePath = fileURLToPath(import.meta.url);
const fileLocation = path.dirname(filePath);

const jitarLocation = path.join(fileLocation, '../../../jitar/dist');
const runtimeLocation = path.join(fileLocation, '../../../runtime/dist');
const reflectionLocation = path.join(fileLocation, '../../../reflection/dist');
const serializationLocation = path.join(fileLocation, '../../../serialization/dist');

export default class JitarController
{
    constructor(app: express.Application)
    {
        app.use('/jitar', express.static(jitarLocation));
        app.use('/jitar-runtime', express.static(runtimeLocation));
        app.use('/jitar-reflection', express.static(reflectionLocation));
        app.use('/jitar-serialization', express.static(serializationLocation));
    }
}
