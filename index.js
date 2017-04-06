const web = require('neutrino-preset-web');
const stylelint = require('neutrino-middleware-stylelint');
const eslint = require('neutrino-middleware-eslint');
const postcss = require('neutrino-middleware-postcss');
const extractStyles = require('neutrino-middleware-extractstyles');
const ManifestPlugin = require('webpack-manifest-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const cssnext = require('postcss-cssnext');

module.exports = (neutrino) => {
  neutrino.use(web);
  neutrino.use(stylelint);
  neutrino.use(eslint);
  neutrino.use(postcss, {
    plugins: [
      cssnext({
        browsers: ['last 2 versions', 'ie 9']
      })
    ]
  });
  neutrino.use(extractStyles, {
    // use: ['css-loader', 'postcss-loader']
  });

  neutrino.config
    .plugins
      .delete('html')
      .delete('copy')
      .end()
    .plugin('manifest')
      .use(ManifestPlugin)
      .end()
    // .plugin('extract')
    //   .use(ExtractTextPlugin, ['[name].[contenthash].css'])
    //   .end()
    // .plugin('copy')
    //   .tap((args) => {
    //     args.options = {
    //       ignore: ['*.js*', '*.css']
    //     }
    //   })
      // .end()
    ;
};
