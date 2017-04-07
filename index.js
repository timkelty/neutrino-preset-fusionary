const web = require('neutrino-preset-web');
const stylelint = require('neutrino-middleware-stylelint');
const eslint = require('neutrino-middleware-eslint');
const extractStyles = require('neutrino-middleware-extractstyles');
const ManifestPlugin = require('webpack-manifest-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const svgSpriteLoader = require.resolve('external-svg-sprite-loader');
const SvgSpritePlugin = require('external-svg-sprite-loader/lib/SvgStorePlugin');

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

  /**
   * 1. https://github.com/postcss/postcss-loader#css-modules
   */

  neutrino.use(extractStyles, {
    filename: '[name].[chunkhash].bundle.css',
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          sourceMap: true,
          importLoaders: 1, /* 1 */
        }
      },
      {
        loader: 'postcss-loader',
        options: postcssConfig,
      },
    ]
  });

  neutrino.config.module
  .rule('img')
  .use('img')
    .loader('img-loader');

  neutrino.config.module
  .rule('svg')
  .use('externalSvgSprite')
    .loader(svgSpriteLoader)
    .options({
      name: 'sprite.[hash].bundle.svg'
    })
    .end()
  .use('img')
    .loader('img-loader');

  neutrino.config.plugins
  // .delete('html')
  .delete('copy');

  neutrino.config
  .plugin('svgStore')
    .use(SvgSpritePlugin)
    .end()
  .plugin('manifest')
    .use(ManifestPlugin)
    .end();
};
