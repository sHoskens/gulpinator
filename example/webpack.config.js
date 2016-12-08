const path      = require('path'),
      merge     = require('webpack-merge'),
      validate  = require('webpack-validator');

const PATHS = {
  app: path.join(__dirname, 'src/scripts', 'main.js'),
  build: path.join(__dirname, 'public/scripts')
};

const common = {
  // Entry accepts a path or an object of entries.
  // We'll be using the latter form given it's
  // convenient with more complex configurations.
  entry: {
    app: PATHS.app
  },
  output: {
    path: PATHS.build,
    filename: '[name].js'
  },
  module : {
    loaders: [
      {
        test   : /.js$/,
        loader : 'babel',
        query: {
          // https://github.com/babel/babel-loader#options
          cacheDirectory: true,
          presets: ['es2015']
        }
      }
    ]
  }
};

let config;

// Detect how npm is run and branch based on that
switch(process.env.npm_lifecycle_event) {
  case 'build':
    config = merge(common);
    break;
  default:
    config = merge(common);
}

module.exports = validate(config);