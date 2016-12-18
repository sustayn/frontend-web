module.exports = function() {
  return {
    module: {
      loaders: [{
        test:   require.resolve('react'),
        loader: 'expose-loader?React',
      }],
    },
  };
};