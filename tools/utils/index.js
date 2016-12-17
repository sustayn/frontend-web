const merge = require('webpack-merge');
const map = require('lodash/map');

function chain(utilTypes, config) {
    return merge.apply(null, map(utilTypes, (util) => require(`./${util}`)(config)));
}

module.exports = {
    clean:           require('./clean'),
    copy:            require('./copy'),
    defineVariables: require('./defineVariables'),
    exposeReact:     require('./exposeReact'),
    gzip:            require('./gzip'),
    refDll:          require('./refDll'),
    stats:           require('./stats'),
    webpackShell:    require('./webpackShell.js'),
    chain:           chain,
};