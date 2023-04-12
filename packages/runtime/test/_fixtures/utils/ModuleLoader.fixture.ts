
const moduleImporter = async (specifier: string) =>
{
    if (specifier === '/root/app/public/app.js')
    {
        return { default: function app() {} };
    }

    throw Error('Not found');
};

export { moduleImporter };
