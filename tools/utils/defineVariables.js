const Webpack = require('webpack');

module.exports = function(env) {
  return {
    plugins: [new Webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV':    JSON.stringify(env.NODE_ENV),
        'BASE_URL':    JSON.stringify(env.BASE_URL),
        'DOMAIN_NAME': JSON.stringify(env.DOMAIN_NAME),
        'ELECTRON':    JSON.stringify(env.ELECTRON),
      },
    })],
  };
};