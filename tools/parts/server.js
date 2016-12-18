const webpack = require('webpack');
const path = require('path');
const WebpackDevServer = require('webpack-dev-server');
const config = require(path.resolve(__dirname, '../webpack.config'))();

const compiler = webpack(config);

new WebpackDevServer(compiler,
  {
    contentBase:        path.resolve(__dirname, '../../build/'),
    publicPath:         'http://localhost:8080/',
    hot:                true,
    inline:             true,
    historyApiFallback: true,
    stats: {
      colors:       true,
      timings:      true,
      chunks:       true,
      modules:      false,
      chunkModules: false,
      children:     true,
      hash:         false,
      version:      false,
      assets:       true,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    quiet:        false,
    noInfo:       false,
    lazy:         false,
    watchOptions: {
      aggregateTimeout: 300,
      poll:             100,
    },

  }
).listen(8080, 'localhost', function (err) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at localhost:8080');
});