import React, { Component } from 'react';
import Route from 'react-router/lib/Route';
import Redirect from 'react-router/lib/Redirect';
import IndexRoute from 'react-router/lib/IndexRoute';

import App from 'containers/App';

import NodesShow from 'views/nodes/NodesShow';
import NotFound from 'views/NotFound';

import { Env, AuthConfig } from 'app/config';

import Views from 'app/views';
import {
  UserIsAuthenticated,
  UserIsNotAuthenticated,
} from 'services/Authorization';

const Authenticated = UserIsAuthenticated((props) => props.children);
const Unauthenticated = UserIsNotAuthenticated((props) => props.children);

const routes = (
  <Route path='/' component={App}>
    {/* Authenticated routes */}
    <Route component={Authenticated}>
      <Route path='user/settings' component={Views.UserSettings} />
    </Route>

    {/* Unauthenticated routes */}
    <Route component={Unauthenticated}>
      <Route path={AuthConfig.forgotRoute} component={Views.AuthForgotPassword} />
      <Route path={AuthConfig.resetRoute} component={Views.AuthPasswordReset} />
      <Route path={AuthConfig.signinRoute} component={Views.AuthSignIn} />
      <Route path={AuthConfig.activateRoute} component={Views.AuthActivate} />
    </Route>

    <Route path='nodes/:id' component={NodesShow} />

    <Route path='/not-found' component={NotFound} />
    <Redirect from='*' to='/not-found' />
  </Route>
);

export default routes;
