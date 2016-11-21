// This file exposes all configuration for the gulp tasks. If the comments do
// not suffice, check out the README.md.

const ROOT = './src';
const TASKS = {
  webpack: 'webpack',
  styles: 'compile-sass',
  jsBundle: 'bundle-js',
  templates: 'compile-templates',
  move: 'move-files'
};
// const webpackConfig = require('./webpack.config');

const defaultConfig = {
  files: [
    {
      target: ROOT + '/scripts/main.js',
      task: TASKS.jsBundle,
      options: {
        dest: 'scripts',
        name: 'myscript'
      }
    },

    {
      target: ROOT + '/scripts/bundle/**/*.js',
      task: TASKS.jsBundle,
      options: {
        dest: 'scripts'
      }
    },

    {
      target: ROOT + '/styles/**/*.scss',
      task: TASKS.styles,
      options: {
        dest: 'styles'
      }
    },

    {
      target: ROOT + '/templates/pages/*.mustache',
      task: TASKS.templates,
      options: {
        useInjection: true,
        templateLang: 'mustache'
      }
    },

    {
      target: ROOT + '/templates/**/*.html',
      task: TASKS.templates,
      options: {
        useInjection: true
      }
    }
  ],

  // Overwrite default global Gulpinator options here
  options: {
    dest: 'public',
    verbose: true,
    paint: 'bazookas'
  }
};

const productionConfig = {
  options: {
    paint: 'gulpinator'
  }
};

/* This file should, at the very least, export a config object as 'default'. Add
   additional environment variables if desired.
   If you run gulp --env=prod, then gulpinator will search for a configuration
   object called 'prod' in the below export, and merge it with the configuration
   object called 'default'.
 */

module.exports = {
  'default': defaultConfig,
  'prod': productionConfig
};
