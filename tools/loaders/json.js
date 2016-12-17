module.exports = function() {
    return {
        module: {
            loaders: [{
                test:   /\.json$/,
                loader: 'json-loader',
            }],
        }
    };
};