const Webpack = require('webpack');
const validate = require('webpack-validator');
const path = require('path');

const getConfig = require('./getConfig');

// os.cpus() => info about each processing thread
const getThreads = () => {
    const cpus = require('os').cpus().length || 0;
    if (cpus >= 8) return 8;
    else if (cpus < 4) return 4;
    else return cpus;
};

module.exports = function(env) {
    env = env || {};
    const ELECTRON = process.env.TARGET === 'electron' || process.env.ELECTRON === 'true';
    const relativeBuildPath = (ELECTRON ? '../electron-build' : '../build');
    // Internal/project config object
    const c = {
        ELECTRON:         ELECTRON,
        ELECTRON_PROCESS: 'main-process.js',
        TARGET:           process.env.TARGET, /* this gets set for the specific build processes */
        LINT:             !env.nolint,
        NO_PROGRESS:      process.env.NO_PROGRESS === 'true',
        LINT_FIX:         env.lintfix,
        SOURCEMAP:        env.sourcemap,
        NUM_THREADS:      getThreads(),
        PATHS:            {
            build:           path.resolve(__dirname, relativeBuildPath),
            electronProcess: path.resolve(__dirname, './electron/main-process.js'),
            node_modules:    path.resolve(__dirname, '../node_modules'),
            ref:             path.resolve(__dirname, '../node_modules/ref'),
            root:            path.resolve(__dirname, '../'),
            styleEntry:      path.resolve(__dirname, '../app/styles/main.scss'),
            windowsDevice:   path.resolve(__dirname, '../WindowsDevice'),

            app:             path.resolve(__dirname, '../app'),
            actions:         path.resolve(__dirname, '../app/actions'),
            assets:          path.resolve(__dirname, '../app/assets'),
            containers:      path.resolve(__dirname, '../app/containers'),
            entry:           path.resolve(__dirname, '../app/index.js'),
            libs:            path.resolve(__dirname, '../app/libs'),
            reducers:        path.resolve(__dirname, '../app/reducers'),
            services:        path.resolve(__dirname, '../app/services'),
            styles:          path.resolve(__dirname, '../app/styles'),
            utils:           path.resolve(__dirname, '../app/utils'),
            views:           path.resolve(__dirname, '../app/views'),
            mirage:          path.resolve(__dirname, '../mirage'),
            test:            path.resolve(__dirname, '../test'),
        },
        BROWSER_LIST: [
            'last 2 versions', '>1%', 'last 1 and_ff version', 'not ie <= 11',
            'not ie_mob <= 11', 'not edge <= 13', 'not op_mini all', 'not opera <= 39',
            'not safari < 10', 'not and_uc <= 10', 'not ios_saf < 19', 'not samsung < 5',
            'not android < 5',
        ]
    };

    const config = getConfig(process.env.npm_lifecycle_event, c);
    return validate(config, { quiet: false });
}
