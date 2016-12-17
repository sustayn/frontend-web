const Webpack = require('webpack');
const path = require('path');

module.exports = function(config) {

    return {
        context: process.cwd(),

        entry: {
            vendor: [path.join(__dirname, '../vendor.js')],
        },

        output: {
            publicPath: (config.ELECTRON ? './' : '/'),
            filename:   '[name].dll.js',
            path:       config.PATHS.build,
            library:    '[name]',
            pathinfo:   true,
        },

        plugins: [
            new Webpack.DllPlugin({
                name: '[name]',
                path: path.join(config.PATHS.build, '[name].json'),
            }),
        ],

        node: {
            fs:            'empty',
            child_process: 'empty',
        },
        externals: [{
            'bindings': `commonjs ${path.resolve(config.PATHS.root, 'tools/electron/externalsBypass.js')}`,
        }],
    };
};