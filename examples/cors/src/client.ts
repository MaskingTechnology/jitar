
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const filePath = fileURLToPath(import.meta.url);
const fileLocation = path.dirname(filePath);

const app = express();
const port = 8080;

app.get('/', (request: Request, response: Response) =>
{
    response.sendFile(path.join(fileLocation, 'index.html'));
});

app.listen(port, () =>
{
    console.log(`Server is listening on port ${port}`);
});
