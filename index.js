const web = require('neutrino-preset-web');
const stylelint = require('neutrino-middleware-stylelint');
const eslint = require('neutrino-middleware-eslint');
const extractStyles = require('neutrino-middleware-extractstyles');
const ManifestPlugin = require('webpack-manifest-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = (neutrino) => {
  const postcssConfig = {
    plugins: [
      require('postcss-easy-import')(),
      require('postcss-assets')({
        loadPaths: ['fonts/', 'img/'],
        basePath: neutrino.options.source,
        relative: true,
      }),
      require('postcss-cssnext')(),
    ]
  };

  neutrino.use(web);
  neutrino.use(stylelint);
  neutrino.use(eslint);

  neutrino.use(extractStyles, {
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          sourceMap: true,
          importLoaders: 1,
        }
      },
      {
        loader: 'postcss-loader',
        options: postcssConfig,
      },
    ]
  });

  // neutrino.config.module.rules.delete('svg');
  // neutrino.config.module
  // .rule('svg')
  // .test(/\.svg(\?v=\d+\.\d+\.\d+)?$/)
  // .use('svg-sprite')
  // .loader('svg-sprite-loader', {
  //   extract: true
  // });

  neutrino.config.module
  .rule('img')
  .use('img')
    .loader('img-loader');

  neutrino.config.module
  .rule('svg')
  .use('img')
    .loader('img-loader')
    .end()
  .use('url')
    .loader('svg-url-loader');

  neutrino.config.plugins
  // .delete('html')
  .delete('copy');

  neutrino.config
  .plugin('manifest')
    .use(ManifestPlugin)
    .end()
  .plugin('extract')
    .use(ExtractTextPlugin, ['[name].[chunkhash].bundle.css'])
    .end();
};
