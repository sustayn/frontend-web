const CompressionPlugin = require("compression-webpack-plugin");

module.exports = function() {
    return {
        plugins: [
            new CompressionPlugin({
                asset: "[path].gz[query]",
                algorithm: 'gzip',
                test: /\.js$|\.html$/,
                threshold: 10240,
                minRatio: 0.8,
            })
        ],
    };
};