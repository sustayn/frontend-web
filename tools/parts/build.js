const HappyPack = require('happypack');
const path = require('path');
const sass = require('node-sass');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Webpack = require('webpack');

module.exports = function(entry, config) {
  return {
    context: config.PATHS.app,

    entry: {
      app: entry,
    },

    output: {
      filename:          '[name].js',
      publicPath:        '/',
      path:              config.PATHS.build,
      pathinfo:          true,
      sourceMapFilename: '[name].js.map',
    },

    plugins: [
      new HtmlWebpackPlugin({
        /* idk why, but it needs ../tools, seems to reference from /app for some reason */
        // HtmlWebpack options
        template:   '../tools/html-template.ejs',
        title:      'React Template',
        // HTML Template options
        appMountId: 'app',
        mobile:     'true',
        scripts:    [
          `/vendor.dll.js`,
        ],
      }),
    ],

    resolve: {
      alias: {
        app:        config.PATHS.app,
        containers: config.PATHS.containers,
        test:       config.PATHS.test,
        mirage:     config.PATHS.mirage,
        actions:    config.PATHS.actions,
        assets:     config.PATHS.assets,
        libs:       config.PATHS.libs,
        reducers:   config.PATHS.reducers,
        services:   config.PATHS.services,
        styles:     config.PATHS.styles,
        utils:      config.PATHS.utils,
        views:      config.PATHS.views,
      },
      //modules: [config.PATHS.app, config.PATHS.node_modules],
      extensions:         ['.webpack.js', '.web.js', '.js', '.jsx', '.json'],
      unsafeCache:        true,
    },
  };
};