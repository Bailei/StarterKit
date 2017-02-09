//This file isn't transpiled, so using commonjs or es5

//Register babel to transpile before our tests run
require('babel-register')();

//disable webpack features that Mocha doesn't understand
require.extensions['.css'] = function() {};
