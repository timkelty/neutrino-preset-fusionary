const web = require('neutrino-preset-web');
const stylelint = require('neutrino-middleware-stylelint');
const eslint = require('neutrino-middleware-eslint');
const extractStyles = require('neutrino-middleware-extractstyles');
const ManifestPlugin = require('webpack-manifest-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SvgSpritePlugin = require('external-svg-sprite-loader/lib/SvgStorePlugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const path = require('path');
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

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

  // https://github.com/haydenbleasel/favicons#usage
  const faviconConfig = {
    logo: path.resolve(neutrino.options.source, 'img/logo.svg'),
    prefix: 'favicons.[hash]/',
    emitStats: true,
    statsFilename: 'favicons.[hash].json',
    persistentCache: true,
  };

  /**
   * Neutrino middlewares
   * 1. https://github.com/postcss/postcss-loader#css-modules
   */

  neutrino.use(web);
  neutrino.use(stylelint);
  neutrino.use(eslint);
  neutrino.use(extractStyles, {
    use: [
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
    ],
  });

  /**
   * Module
   * 1. https://github.com/karify/external-svg-sprite-loader/issues/18
   */

  neutrino.config.module.rule('modernizr')
  .test(/\.modernizr-autorc$/)
  .use('modernizr')
    .loader('modernizr-auto-loader')
    .end();

  neutrino.config.module.rule('img')
  .use('img')
    .loader('img-loader')
    .end();

  neutrino.config.module.rule('svg')
  .uses.delete('url').end() /* 1 */
  .use('img')
    .loader('img-loader')
    .end()
  .use('externalSvgSprite')
    .loader(require.resolve('external-svg-sprite-loader'))
    .options({
      name: 'sprite.[hash].bundle.svg'
    })
    .end();

  neutrino.config.module.rule('jquery')
  .test(/^jquery$/)
  .use('jQuery')
    .loader('expose-loader')
    .options('jQuery')
    .end()
  .use('$')
    .loader('expose-loader')
    .options('$')
    .end();

  neutrino.config.module.rule('webfontloader')
  .test(/^webfontloader$/)
  .use('webfontloader')
    .loader('expose-loader')
    .options('WebFont')
    .end();

  /**
   * Alias
   */

  neutrino.config.resolve.alias
  .set('modernizr$', path.resolve(neutrino.options.root, '.modernizr-autorc'))

  /**
   * Webpack Plugins
   */

  neutrino.config
  .plugins
    // .delete('html')
    .delete('copy')
    .end()
  .plugin('svgSprite')
    .use(SvgSpritePlugin)
    .end()
  .plugin('manifest')
    .use(ManifestPlugin)
    .end()
  .when(isProduction, (config) => {
    config.plugin('favicons')
      .use(FaviconsWebpackPlugin, [faviconConfig])
      .end();
  })
  .plugin('extract')
    .tap(args => {
      return [{
        filename: '[name].[chunkhash].bundle.css',
        allChunks: true,
        ignoreOrder:  true,
      }]
    })
    .end()
  ;
};
