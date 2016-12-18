const StatsPlugin = require('stats-webpack-plugin');

module.exports = function() {
  return {
    profile: true,
    plugins: [
      new StatsPlugin('stats.json', {
        chunkModules: true,
      }),
    ],
  };
};
