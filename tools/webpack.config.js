const Webpack = require('webpack');
const validate = require('webpack-validator');
const path = require('path');

const getConfig = require('./getConfig');

// os.cpus() => info about each processing thread
const getThreads = () => {
  const cpus = require('os').cpus().length || 0;
  if (cpus >= 8) return 8;
  else if (cpus < 4) return 4;
  else return cpus;
};

module.exports = function(env) {
  env = env || {};
  // Internal/project config object
  const c = {
    TARGET:           process.env.TARGET, /* this gets set for the specific build processes */
    LINT:             !env.nolint,
    NO_PROGRESS:      process.env.NO_PROGRESS === 'true',
    LINT_FIX:         env.lintfix,
    SOURCEMAP:        env.sourcemap,
    NUM_THREADS:      getThreads(),
    PATHS:            {
      build:           path.resolve(__dirname, '../build'),
      node_modules:    path.resolve(__dirname, '../node_modules'),
      root:            path.resolve(__dirname, '../'),
      styleEntry:      path.resolve(__dirname, '../app/styles/main.scss'),

      app:             path.resolve(__dirname, '../app'),
      actions:         path.resolve(__dirname, '../app/actions'),
      assets:          path.resolve(__dirname, '../app/assets'),
      channels:        path.resolve(__dirname, '../app/channels'),
      containers:      path.resolve(__dirname, '../app/containers'),
      entry:           path.resolve(__dirname, '../app/index.js'),
      libs:            path.resolve(__dirname, '../app/libs'),
      reducers:        path.resolve(__dirname, '../app/reducers'),
      services:        path.resolve(__dirname, '../app/services'),
      styles:          path.resolve(__dirname, '../app/styles'),
      utils:           path.resolve(__dirname, '../app/utils'),
      views:           path.resolve(__dirname, '../app/views'),
      mirage:          path.resolve(__dirname, '../mirage'),
      test:            path.resolve(__dirname, '../test'),
    },
  };

  const config = getConfig(process.env.npm_lifecycle_event, c);
  return validate(config, { quiet: false });
}
