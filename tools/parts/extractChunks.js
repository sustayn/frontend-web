const Webpack = require('webpack');

module.exports = function(vendorFiles) {
  return {
    entry: {
      vendor: vendorFiles,
    },
    plugins: [
      new Webpack.optimize.CommonsChunkPlugin({
        names: ['vendor', 'manifest'],
        minChunks: Infinity
      })
    ],
  };
};