import React, { Component } from 'react';
import { Provider } from 'react-redux';
import Router from 'react-router/lib/Router';

import { configureStore } from 'app/store';

const { store, history } = configureStore({});

export default class Root extends Component {
  render() {
    const { routes } = this.props;
    return (
      <Provider store={store} key='provider' className='spec-provider'>
      <Router history={history} routes={routes} />
      </Provider>
    );
  }
}
