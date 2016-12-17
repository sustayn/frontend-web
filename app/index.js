import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import routes from 'app/routes';
import Root from 'containers/Root';

const appEl = document.getElementById('app');

ReactDOM.render(
    <AppContainer>
        <Root routes={routes} />
    </AppContainer>,
    appEl
);

console.log(process.env);

// Hot Module Replacement API
if (module.hot) {
    module.hot.accept([
        './containers/Root.js',
        './routes.js',
    ], () => {
        console.log('module.hot.accept');

        const nextRoutes = require('app/routes').default;
        const hotReloadRoutes = require('utils/hotReloadRoutes').default;

        hotReloadRoutes(routes, nextRoutes);

        ReactDOM.render(
            <AppContainer>
                <Root routes={routes} />
            </AppContainer>,
            appEl
        );
    });
}

