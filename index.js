const web = require('neutrino-preset-web');
const stylelint = require('neutrino-middleware-stylelint');
const eslint = require('neutrino-middleware-eslint');
// const postcss = require('neutrino-middleware-postcss');
const extractStyles = require('neutrino-middleware-extractstyles');
const ManifestPlugin = require('webpack-manifest-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SvgSpritePlugin = require('webpack-svg-sprite-plugin')

module.exports = (neutrino) => {
  const postcssConfig = {
    plugins: [
      require('postcss-easy-import')(),
      require('postcss-assets')({
        loadPaths: ['fonts/', 'img/'],
        basePath: neutrino.options.source,
      }),
      require('postcss-cssnext')({
        browsers: [
          'last 2 versions',
          'ie >= 9',
        ]
      }),
    ]
  };

  neutrino.use(web);
  neutrino.use(stylelint);
  neutrino.use(eslint);

  // neutrino.use(postcss, {
  //   plugins: [
  //     cssnext({
  //       browsers: ['last 2 versions', 'ie 9']
  //     })
  //   ]
  // });

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

  neutrino.config.module
  .rule('img')
    .use('img')
    .loader('img-loader')
    .end();

  neutrino.config.module
  .rule('svg')
    .use('img')
    .loader('img-loader')
    .end();

  neutrino.config.plugins
  // .delete('html')
  .delete('copy');

  neutrino.config
  // .plugin('svgSprite')
  //   .use(SvgSpritePlugin, {
  //      filename: 'my-sprite.svg',
  //   })
  //   .end()
  .plugin('manifest')
    .use(ManifestPlugin)
    .end()
  .plugin('extract')
    .use(ExtractTextPlugin, ['[name].[chunkhash].bundle.css'])
    .end()
  // .plugin('copy')
  //   .tap((args) => {
  //     args.options = {
  //       ignore: ['*.js*', '*.css']
  //     }
  //   })
    .end();
};
