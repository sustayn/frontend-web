// Prevent Mocha from compiling class
function noop() {
  return null;
}

require.extensions['.css'] = noop;
require.extensions['.scss'] = noop;
require.extensions['.jpg'] = noop;