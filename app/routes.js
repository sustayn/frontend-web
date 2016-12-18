import React, { Component } from 'react';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';

import App from 'containers/App';

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

    <Route path='*' component={NotFound} />
  </Route>
);

export default routes;
