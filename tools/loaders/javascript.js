const HappyPack = require('happypack');
const path = require('path');

module.exports = function(config) {
    const loaders = ['babel-loader'];
    if(config.LINT) loaders.push(`eslint-loader${config.LINT_FIX ? '?{fix:true}' : ''}`);

    return {
        module: {
            loaders: [{
                test:    /\.(js|jsx)$/,
                exclude: /node_modules/,
                include: [
                    config.PATHS.app,
                    config.PATHS.mirage
                ],
                loader: path.resolve(__dirname, '../../node_modules/happypack/loader.js?id=javascript'),
                //loaders: ['happypack/loader?id=javascript'],
            }]
        },

        plugins: [
            new HappyPack({
                loaders: loaders,
                threads: config.NUM_THREADS,
                id:      'javascript',

                // DANGER ZONE: HappyPack cache maybe breaks source maps
                cache:   true,
            }),
        ]
    };
};