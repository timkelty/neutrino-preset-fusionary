module.exports = function(options) {
  return {
    plugins: [
      require('postcss-easy-import')(),
      require('postcss-assets')({
        loadPaths: ['fonts/', 'img/'],
        basePath: options.source,
        relative: true,
      }),
      require('postcss-cssnext')(),
    ],
  };
}
