module.exports = function(config) {
    return {
        module: {
            loaders: [{
                test:    /\.(jpg|png|svg|stl)$/,
                include: config.PATHS.assets,
                exclude: /node_modules/,
                loader:  'url-loader?limit=2500000',
            }],
        },
    };
};