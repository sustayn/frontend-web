import React, { PropTypes, Component } from 'react';
import { Provider } from 'react-redux';
import Router from 'react-router/lib/Router';

if(!process.env.BASE_URL) {
  require('mirage/index');
}

import { Env, DevEnv } from 'app/config';
import { configureStore } from 'app/store';
import { initialState } from 'reducers/initialState';

const state = DevEnv.acceptInitialState ? initialState : {};
const { store, history } = configureStore(state);

if(!Env.isElectron) {
  React.Perf = require('react-addons-perf');
}

export default class Root extends Component {
  render() {
    const { routes } = this.props;
    return (
      <Provider store={store} key='provider'>
      <Router history={history} routes={routes} />
      </Provider>
    );
  }
}
