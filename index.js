const path = require('path');
const web = require('neutrino-preset-web');
const stylelint = require('neutrino-middleware-stylelint');
const eslint = require('neutrino-middleware-eslint');
const extractStyles = require('neutrino-middleware-extractstyles');
const ManifestPlugin = require('webpack-manifest-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SvgSpritePlugin = require('external-svg-sprite-loader/lib/SvgStorePlugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const dotenv = require('dotenv').config();
const { defaultTo } = require('ramda');

module.exports = (neutrino) => {

  const isProduction = process.env.NODE_ENV === 'production';
  const isDevelopment = process.env.NODE_ENV === 'development';
  const devProxy = process.env.DEV_PROXY;
  const customOptions = neutrino.options.fusionary || {};
  const setPathDefaults = defaultTo(true, customOptions.setPathDefaults);
  const spa = defaultTo(false, customOptions.spa);

  /**
   * Neutrino options
   * https://neutrino.js.org/customization/simple.html#overriding-neutrino-options
   */

  if (setPathDefaults) {
    Object.assign(neutrino.options, {
      source: './app/assets',
      output: './public/assets',
      entry: './js/index.js',
    });
  }

  /**
   * Neutrino middlewares
   * 1. https://github.com/postcss/postcss-loader#css-modules
   * 2. WIP: https://github.com/barraponto/neutrino-preset-stylelint
   */

  neutrino.use(web);
  neutrino.use(stylelint, {
    files: [path.join(neutrino.options.source +  '**/*.+css')], /* 2 */
  });
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
        options: require('./config/postcss')(neutrino.options),
      },
    ],
  });

  /**
   * config.*
   */

  neutrino.config.when(isDevelopment && devProxy, (config) => {
    config.devServer.proxy({
      '/': {
        target: devProxy,
        changeOrigin: true,
      }
    });
  });

  neutrino.config.entry('head')
  .add(path.join(neutrino.options.source, 'js/head.js'));

  neutrino.config.resolve
  .alias
    .set('modernizr$', path.resolve(__dirname, '.modernizr-autorc'))
    .end()
  .modules
    .add(neutrino.options.source)
    .add(path.join(neutrino.options.source, 'js'));

  /**
   * config.module.rule
   * 1. https://github.com/karify/external-svg-sprite-loader/issues/18
   */

  neutrino.config.module.rule('modernizr')
  .test(/\.modernizr-autorc$/)
  .use('modernizr')
    .when(isProduction, (config) => {
      config.loader('modernizr-auto-loader');
    }, (config) => {
      config.loader('null-loader');
    });

  neutrino.config.module.rule('img')
  .when(isProduction, (config) => config.use('img').loader('img-loader'));

  neutrino.config.module.rule('svg')
  .uses.delete('url').end() /* 1 */
  .when(isProduction, (config) => config.use('img').loader('img-loader'))
  .use('externalSvgSprite')
    .loader(require.resolve('external-svg-sprite-loader'))
    .options({
      name: 'sprites.[hash].svg'
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
   * config.plugin(s)
   */

  neutrino.config
  .plugins
    .when(!spa, (config) => {
      config.delete('html');
    })
    .delete('copy')
    .end()
  .when(isProduction, (config) => {
    config
    .plugin('favicons')
      .use(FaviconsWebpackPlugin, [
        require('./config/favicon')(neutrino.options)
      ])
      .end()
    .plugin('minify')
      .tap(() => [{
        removeConsole: true,
        removeDebugger: true,
      }])
      .end()
    .plugin('optimizeCss')
      .use(OptimizeCssAssetsPlugin)
      .end();
  })
  .plugin('svgSprite')
    .use(SvgSpritePlugin)
    .end()
  .plugin('manifest')
    .use(ManifestPlugin)
    .end()
  .plugin('extract')
    .tap(args => [{
      filename: '[name].[chunkhash].css',
      allChunks: true,
      ignoreOrder:  true,
    }])
    .end();
};
