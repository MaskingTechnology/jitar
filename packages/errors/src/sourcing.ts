
const ROOT_PARTS = import.meta.url.split('/');
ROOT_PARTS.pop();

const ROOT_FOLDER = ROOT_PARTS.join('/');

export default function createSource(filename: string): string
{
    return filename.substring(ROOT_FOLDER.length);
}
