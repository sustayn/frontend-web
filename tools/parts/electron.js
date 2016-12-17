module.exports = function(config) {
    const path = require('path');
    return {
        target:    'electron-renderer',
        devtool:   config.SOURCEMAP || 'eval',
        watch:     true,
        externals: [{
            'bindings': `commonjs ${path.resolve(config.PATHS.root, 'tools/electron/externalsBypass.js')}`,
        }],
        node: {
            fs: 'empty',
        },
    };
};