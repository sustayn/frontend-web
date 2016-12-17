const merge = require('webpack-merge');
const map = require('lodash/map');

module.exports = function(loaderTypes, config) {
    return merge.apply(null, map(loaderTypes, (loader) => require(`./${loader}`)(config)));
};