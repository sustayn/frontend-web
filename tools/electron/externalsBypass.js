module.exports = function(type) {
    const path = require('path');
    if (type === 'binding') {
        const ref = path.resolve(__dirname, '../../node_modules/ref/build/Release/binding.node');
        return require(ref);
    } else if (type === 'ffi_bindings.node') {
        const ffi = path.resolve(__dirname, '../../node_modules/ffi/build/Release/ffi_bindings.node');
        return require(ffi);

    }
}