const Extractor = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const Happypack = require('happypack');
const path = require('path');

module.exports = function(config) {
    const loaders = (process.env.NODE_ENV !== 'production' ?
        ['css-loader', 'sass-loader'] :
        ['css-loader', 'postcss-loader', 'sass-loader']);

    let styles = {
        entry: {
            style: config.PATHS.styleEntry,
        },
        module: {
            loaders: [{
                test:   /\.scss$/,
                loader: Extractor.extract({
                    loader: path.resolve(__dirname, '../../node_modules/happypack/loader.js?id=styles')
                }),
                include: config.PATHS.styles,
            }],
        },
        plugins: [
            new Extractor('[name].css'),
            new Happypack({
                loaders: loaders,
                threads: config.NUM_THREADS,
                id:      'styles',
                cache:   true,
            })
        ],
    };

    if(process.env.NODE_ENV === 'production') styles.postcss = [autoprefixer({ browsers: [c.BROWSER_LIST] })];

    return styles;
};