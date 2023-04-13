
module.exports = {
  meta: {
      name: 'eslint-plugin-jitar',
      version: '0.0.1',
      docs: {
          description: 'Enforce an empty first line of file',
          category: 'Possible Errors',
          recommended: true,
      },
      schema: [], // no options
  },

  rules: {
      'no-empty-first-line': {
          create: function (context) {
  
            return {
                Program: function (node) {
                    const sourceCode = context.getSourceCode();
                    const firstToken = sourceCode.getFirstToken(node);
    
                    if (firstToken.loc.start.line === 1 && firstToken.value)
                    {
                        context.report({
                            node,
                            loc: firstToken.loc,
                            message: 'The first line of the file should be empty',
                        });
                    }
                  },
              };
          },
      },
  },
};
