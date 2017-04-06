const ManifestPlugin = require('webpack-manifest-plugin');
const web = require('neutrino-preset-web');
const stylelint = require('neutrino-middleware-stylelint');
const eslint = require('neutrino-middleware-eslint');
const postcss = require('neutrino-middleware-postcss');
const cssnext = require('postcss-cssnext');

module.exports = (neutrino) => {
  neutrino.use(web);
  neutrino.use(stylelint, {
    config: {
      extends: 'stylelint-config-suitcss',
    }
  });
  neutrino.use(eslint, {
    baseConfig: {
      extends: ['kswedberg'],
    },
  });

  neutrino.use(postcss, {
    plugins: [
      cssnext()
    ]
  });

  neutrino.config
    .plugins
      .delete('html')
      .end()
    .plugin('manifest')
      .use(ManifestPlugin)
      .end();
};
