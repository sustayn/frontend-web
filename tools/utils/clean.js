const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');

module.exports = function(config) {
  return {
    plugins: [
      new CleanWebpackPlugin([config.PATHS.build], {
        // Without `root` CleanWebpackPlugin won't point to our
        // project and will fail to work.
        root:    config.PATHS.root,
        verbose: true,
        exclude: ['vendor.json', 'vendor.dll.js'],
      }),
    ],
  };
};