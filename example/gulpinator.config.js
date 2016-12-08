// This file exposes all configuration for the gulp tasks. If the comments do
// not suffice, check out the README.md.
const ROOT = './src';
const path = require('path');
const TASKS = require('../utilities/taskNames');

const defaultConfig = {
  files: [
    {
      target: ROOT + '/scripts/main.js',
      task: TASKS.webpack,
      options: {
        dest: 'scripts',
        watch: true,
        webpack: {
          entry: path.join(__dirname, ROOT, 'scripts', 'main.js'),
          output: path.join(__dirname, 'public', 'scripts')
        }
        // customWebpackConfig: process.cwd() + '/webpack.config.js'
      }
    },

    {
      target: [
        ROOT + '/scripts/bundle/**/*.js',
        ROOT + '/scripts/test/*.js'
      ],
      task: TASKS.jsBundle,
      options: {
        dest: 'scripts',
        minify: true,
        sourcemaps: true,
        watch: true
      }
    },

    {
      target: ROOT + '/styles/**/*.scss',
      task: TASKS.styles,
      options: {
        dest: 'styles',
        watch: true,
        sourcemaps: true
      }
    },

    {
      target: ROOT + '/templates/pages/*.mustache',
      task: TASKS.templates,
      options: {
        useInjection: false,
        templateLang: 'mustache',
        watch: true
      }
    },

    {
      target: ROOT + '/templates/**/*.html',
      task: TASKS.templates,
      options: {
        useInjection: false,
        watch: true
      }
    }
  ],

  // Overwrite default global Gulpinator options here
  options: {
    dest: 'public',
    verbose: true,
    paint: 'bazookas',
    browsersync: {
      staticHtmlServer: true
    }
  }
};

const productionConfig = {
  options: {
    dest: 'dist',
    paint: false,
    verbose: false
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
