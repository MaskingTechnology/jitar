
import { File } from '@jitar/sourcing';

export default class TestFileManager
{
    readonly #files: Record<string, File>;

    constructor(files: Record<string, File>)
    {
        this.#files = files;
    }

    exists(filename: string): Promise<boolean>
    {
        for (const key in this.#files)
        {
            const value = this.#files[key];

            if (value.location === filename)
            {
                return Promise.resolve(true);
            }
        }

        return Promise.resolve(false);
    }

    read(filename: string): Promise<File>
    {
        let file: File | undefined;

        for (const key in this.#files)
        {
            const value = this.#files[key];

            if (value.location === filename)
            {
                file = value;

                break;
            }
        }

        return Promise.resolve(file as File);
    }
}
