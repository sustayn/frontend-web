const HappyPack = require('happypack');
const BabiliPlugin = require('babili-webpack-plugin');
const path = require('path');

module.exports = function(config) {
  const loaders = ['babel-loader?plugins[]=recharts'];
  if(config.LINT) loaders.push(`eslint-loader${config.LINT_FIX ? '?{fix:true}' : ''}`);

  const plugins = [
    new HappyPack({
      loaders: loaders,
      threads: config.NUM_THREADS,
      id:      'javascript',

      // DANGER ZONE: HappyPack cache maybe breaks source maps
      cache: true,
    }),
  ];
  if(process.env.NODE_ENV === 'production') plugins.push(new BabiliPlugin());

  return {
    plugins: plugins,
    module:  {
        loaders: [{
          test:    /worker\.js$/,
          loader:  'worker-loader',
          exclude: /node_modules/,
          include: [
            config.PATHS.app,
          ],
        }, {
          test:    /\.(js|jsx)$/,
          exclude: /node_modules/,
          include: [
            config.PATHS.app,
            config.PATHS.mirage,
          ],
          loader: path.resolve(__dirname, '../../node_modules/happypack/loader.js?id=javascript'),
        }],
    },
  };
};