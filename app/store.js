import React from 'react';
import browserHistory from 'react-router/lib/browserHistory';
import { syncHistoryWithStore, routerMiddleware, push } from 'react-router-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import ActionCable from 'actioncable';

import { Env, DevEnv } from 'app/config';

import authEpics from 'actions/Auth';
import nodeEpics from 'actions/Nodes';
import authServiceEpics from 'services/authentication/epics';
import flashServiceEpics from 'services/flash/epics';

import NodeChannel from 'channels/node-channel';

// Reducer
import { reducer } from 'reducers/index.js';

const rootEpic = combineEpics(
  ...authEpics,
  ...nodeEpics,
  ...authServiceEpics,
  ...flashServiceEpics
);

function createCableMiddleware(socket, ...ChannelClasses) {
  return (store) => {
    const Cable = ActionCable.createConsumer(socket);
    const channels = ChannelClasses.map((ChannelClass) => new ChannelClass(Cable, store));
    return (next) => (action) => {
      channels.forEach((channel) => channel.handleAction(action));
      return next(action);
    };
  };
}

const cableMiddleware = createCableMiddleware('ws://localhost:3000/cable', NodeChannel);

const createEnhancer = () => {
  const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        /* devtools config goes here */
      }) : compose;

  const navMiddleware = routerMiddleware(browserHistory);
  const epicMiddleware = createEpicMiddleware(rootEpic);

  return composeEnhancers(
    applyMiddleware(cableMiddleware, epicMiddleware, navMiddleware),
    /* if needed, other store enhancers go here */
  );
};

// Create store
export const configureStore = (initialState) => {
  const enhancer = createEnhancer();
  const store = createStore(reducer, initialState, enhancer);

  const history = syncHistoryWithStore(browserHistory, store);
  if(DevEnv && DevEnv.autoLogin) store.dispatch(push(DevEnv.startingRoute));

  return { store, history };
};
