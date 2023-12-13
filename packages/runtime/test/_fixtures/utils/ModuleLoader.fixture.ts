
const moduleImporter = async (specifier: string) =>
{
    switch (specifier)
    {
        case '/root/app/public/app.js': return { default: function app() {} };
        case 'jitar': return { default: class Jitar {} };
    }
    
    throw Error('Not found');
};

export { moduleImporter };
