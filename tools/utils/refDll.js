const Webpack = require('webpack');
const path = require('path');

module.exports = function(config) {
  return {
    plugins: [
      new Webpack.DllReferencePlugin({
        context:  config.PATHS.root,
        manifest: require(path.join(config.PATHS.build, 'vendor.json')),
      })
    ],
  };
};