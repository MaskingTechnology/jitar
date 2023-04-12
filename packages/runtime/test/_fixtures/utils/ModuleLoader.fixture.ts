
const moduleImporter = async (specifier: string) =>
{
    if (specifier === '/root/app/public/app.js')
    {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        return { default: function app() {} };
    }

    throw Error('Not found');
};

export { moduleImporter };
