const Webpack = require('webpack');
const map = require('lodash/map');

module.exports = function(options) {
  return {
    plugins: [ new Webpack.DefinePlugin(options) ],
  };
};