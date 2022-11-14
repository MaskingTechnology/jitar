
import { Controller } from '@overnightjs/core';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const filePath = fileURLToPath(import.meta.url);
const fileLocation = path.dirname(filePath);
const rootLocation = path.join(fileLocation, '../../../jitar/dist');

@Controller('')
export default class JitarController
{
    constructor(app: express.Application)
    {
        app.use('/jitar', express.static(rootLocation));
    }
}
