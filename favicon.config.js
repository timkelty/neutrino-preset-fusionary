const path = require('path');

module.exports = function(options) {
  return {
    logo: path.resolve(neutrino.options.source, 'img/logo.svg'),
    prefix: 'favicons.[hash]/',
    emitStats: true,
    statsFilename: 'favicons.[hash].json',
    persistentCache: true,
  };
}
