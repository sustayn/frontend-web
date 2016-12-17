const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');

const getVendorList = require('./helpers/getVendorList');

const parts = require('./parts');
const loaders = require('./loaders');
const utils = require('./utils');

module.exports = function(event, c) {
    // Webpack config object
    let config = {};

    // if process.env.npm_lifecycle_event is 'build',
    // then process.env.TARGET should be appended
    const eventTarget = c.TARGET ? `build-${c.TARGET}` : event;

    // Detect how npm is run and branch based on that
    switch (eventTarget) {
        case 'serve':
            const entry = [
                'react-hot-loader/patch',
                // activate HMR for React

                'webpack/hot/only-dev-server',
                // bundle the client for hot reloading
                // only- means to only hot reload for successful updates

                'webpack-dev-server/client?http://localhost:8080',
                // bundle the client for webpack-dev-server
                // and connect to the provided endpoint

                c.PATHS.entry,
                // the entry point of our app
            ];

            config = merge(
                parts.common(c),
                parts.build(entry, c),
                loaders(['javascript', 'url', 'styles', 'json'], c),
                utils.chain(['refDll', 'exposeReact'], c),
                utils.defineVariables({
                    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
                    'process.env.BASE_URL': JSON.stringify(process.env.BASE_URL),
                }),
                {
                    devtool: /*c.SOURCEMAP ||*/ 'eval',
                    node:    {fs: 'empty'},
                    target:  'web',
                    plugins: [
                        new webpack.HotModuleReplacementPlugin({multiStep: false}),

                        new webpack.NamedModulesPlugin(),
                        // prints more readable module names in the browser console on HMR updates
                    ],
                }
            );
            break;

        case 'build-electron':
            config = merge(
                parts.common(c),
                parts.build(c.PATHS.entry, c),
                parts.electron(c),
                loaders(['javascript', 'url', 'styles', 'json'], c),
                utils.chain(['refDll', 'exposeReact'], c),
                utils.defineVariables({
                    'process.env.NODE_ENV':    JSON.stringify(process.env.NODE_ENV),
                    'process.env.IS_ELECTRON': true,
                }),
                utils.copy({'from': c.PATHS.electronProcess, 'to': 'index.js'}),
                utils.webpackShell({'process': c.ELECTRON_PROCESS})
            );
            break;

        case 'build-web':
            const vendorFiles = getVendorList(['three', 'react-three-renderer']);
            const utilsToUse = (process.env.NODE_ENV === 'production') ?
                ['gzip', 'stats'] : ['refDll', 'exposeReact', 'stats'];

            config = merge(
                parts.common(c),
                parts.build(c.PATHS.entry, c),
                process.env.NODE_ENV === 'production' ? parts.extractChunks(vendorFiles) : {},
                loaders(['javascript', 'url', 'styles', 'json'], c),
                utils.defineVariables({
                    'process.env.NODE_ENV':    JSON.stringify(process.env.NODE_ENV),
                    'process.env.BASE_URL':    JSON.stringify(process.env.BASE_URL),
                    'process.env.DOMAIN_NAME': JSON.stringify(process.env.DOMAIN_NAME),
                }),
                utils.chain(utilsToUse, c),
                {
                    node: {
                        fs: 'empty'
                    },
                    target: 'web'
                }
            );
            break;

        case 'build-dll':
            config = merge(
                parts.common(c),
                loaders(['json'], c),
                parts.dll(c)
            );
            break;

        default:
            config = merge(parts.common, {});
    }

    return config;
};