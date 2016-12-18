const Webpack = require('webpack');
const HappyPack = require('happypack');
const path = require('path');
const sass = require('node-sass');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const Dashboard = require('webpack-dashboard');
const DashboardPlugin = require('webpack-dashboard/plugin');
//const dashboard = new Dashboard();

const pkg = require('../package.json');

exports.main = function(config) {

  return {

    cache: true,

    context: config.PATHS.app,

    entry: {
      app: config.PATHS.entry,
    },

    externals: {
      Config: JSON.stringify({
        assets: path.resolve(__dirname, '../app/assets'),
        libs:   path.resolve(__dirname, '../app/libs'),
        root:   path.resolve(__dirname, '../app'),
        shared: path.resolve(__dirname, '../app/shared'),
        styles: path.resolve(__dirname, '../app/styles'),
        util:   path.resolve(__dirname, '../app/utils'),
      }),
    },

    module: {
      loaders: [{
        test:    /\.(js|jsx)$/,
        exclude: /node_modules/,
        include: [
          path.resolve(config.PATHS.libs, 'react-routing/src'),
          config.PATHS.app,
          config.PATHS.mirage,
        ],
        loaders: ['happypack/loader?id=jsx'],
      }, {
        test:    /\.(jpg|png|svg)$/,
        include: config.PATHS.assets,
        loader:  'url',
      }, {
        test:   require.resolve('react'),
        loader: 'expose?React',
      }, {
        test:   /\.json$/,
        loader: 'json-loader',
      }],

    },

    eslint: {
      // potentially dangerous...
      //fix: true,

      formatter: require('eslint/lib/formatters/table'),
    },

    output: {
      filename:          '[name].js',
      publicPath:        '/',
      path:              'build',
      pathinfo:          true,
      sourceMapFilename: '[name].js.map',
    },

    plugins: [
      //new Webpack.SourceMapDevToolPlugin({
      //    filename: '[file].map',
      //}),
      new Webpack.DllReferencePlugin({
        context:  path.resolve(__dirname, '..'),
        manifest: require(path.resolve(__dirname, '../build/vendor.json')),
      }),
      new HappyPack({
        loaders: config.LINT ?
          ['babel?cacheDirectory', 'eslint'] :
          ['babel?cacheDirectory'],
        threads: config.NUM_THREADS,
        id:      'jsx',

        // DANGER ZONE: HappyPack cache breaks source maps
        cache:   false,
      }),
      new HtmlWebpackPlugin({
        /* idk why, but it needs ../tools, seems to reference from /app for some reason */
        template:   '../tools/html-template.ejs',
        appMountId: 'app',
        mobile:     'true',
        title:      'React Demo',
        scripts:    [
          '/build/vendor.dll.js',
        ],
      }),
      //new DashboardPlugin(dashboard.setData),
    ],


    resolve: {
      root:               [config.PATHS.app, config.PATHS.build],
      modulesDirectories: [config.PATHS.build, config.PATHS.app, 'node_modules'],
      extensions:         ['', '.webpack.js', '.web.js', '.js', '.jsx', '.json'],
      unsafeCache:        true,
    },

    devtool: config.SOURCE_MAP ?
      'cheap-module-eval-source-map' :
      'eval',

  };

};