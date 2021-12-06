const CracoLessPlugin = require('craco-less');
const { getThemeVariables } = require('antd/dist/theme');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              ...getThemeVariables({
                dark: false,
                compact: false,
              }),
              '@primary-color': 'hsl(155, 80%, 70%)',
              '@body-background': 'hsl(155, 12%, 10%)',
              '@black': 'hsl(155, 4%, 95%)',
              '@white': 'hsl(155, 12%, 10%)',
              '@component-background': 'hsl(155, 10%, 15%)',
              '@btn-primary-color': 'hsl(155, 12%, 10%)',
              '@layout-header-background': 'hsl(155, 10%, 15%)',
              '@text-color-secondary-dark': 'hsl(155, 4%, 80%)',
              '@border-color-base': 'hsl(155, 6%, 60%)',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
