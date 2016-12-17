const path = require('path');

module.exports = {
    resolve: {
        alias: {
            app:             path.resolve(__dirname, '../app'),
            actions:         path.resolve(__dirname, '../app/actions'),
            assets:          path.resolve(__dirname, '../app/assets'),
            containers:      path.resolve(__dirname, '../app/containers'),
            libs:            path.resolve(__dirname, '../app/libs'),
            reducers:        path.resolve(__dirname, '../app/reducers'),
            services:        path.resolve(__dirname, '../app/services'),
            styles:          path.resolve(__dirname, '../app/styles'),
            utils:           path.resolve(__dirname, '../app/utils'),
            views:           path.resolve(__dirname, '../app/views'),
            mirage:          path.resolve(__dirname, '../mirage'),
            test:            path.resolve(__dirname, '../test'),
        }
    }
}