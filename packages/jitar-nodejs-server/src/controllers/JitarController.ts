
import { Controller } from '@overnightjs/core';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const filePath = fileURLToPath(import.meta.url);
const fileLocation = path.dirname(filePath);

const jitarLocation = path.join(fileLocation, '../../../jitar/dist');
const runtimeLocation = path.join(fileLocation, '../../../jitar-runtime/dist');
const reflectionLocation = path.join(fileLocation, '../../../jitar-reflection/dist');
const serializationLocation = path.join(fileLocation, '../../../jitar-serialization/dist');

@Controller('')
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
