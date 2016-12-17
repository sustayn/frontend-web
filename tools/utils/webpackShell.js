
module.exports = (options) => {
    const WebpackShellPlugin = require('../plugins/WebpackShellPlugin.js');
    return {
        plugins: [
            new WebpackShellPlugin({
                onBuildEnd: ['npm run electron'],
                mainProcess: options.process,
            }),
        ],
    };

};