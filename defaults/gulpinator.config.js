// This file exposes all configuration for the gulp tasks. If the comments do
// not suffice, check out the README.md.
const ROOT = './src';
const VENDOR = './vendor'
const path = require('path');
const TASKS = require('gulpinator/utilities/taskNames');

// Some sensible defaults, to get you started.
let bundleLibs = {
  target: [
    VENDOR + '/**/*.js' // TODO change this to correct paths to your library files, like jQuery, angular, etc...
  ],
  task: TASKS.jsBundle,
  options: {
    dest: 'scripts',
    sourcemaps: true,
    watch: true
  }
};

let compileStyles = {
  target: ROOT + '/styles/**/*.scss',
  task: TASKS.styles,
  options: {
    dest: 'styles',
    watch: true
  }
};

let buildApp = {
  target: ROOT + '/scripts/app.js',
  task: TASKS.webpack,
  options: {
    dest: 'scripts',
    watch: true,
    webpack: {
      entry: path.join(__dirname, ROOT, 'scripts', 'app.js'),
      output: path.join(__dirname, 'public', 'scripts')
    }
  }
};

let compileOrMoveTemplates = {
  target: ROOT + '/templates/**/*.html',
  task: TASKS.templates,
  options: {
    useInjection: true,
    watch: true
  }
};

// Default configuration object, dev environment
const defaultConfig = {
  files: [
    buildApp,
    bundleLibs,
    compileStyles,
    compileOrMoveTemplates
  ],

  // Overwrite default global Gulpinator options here
  options: {
    dest: 'public',
    verbose: true,
    paint: 'gulpinator',
    browsersync: {
      staticHtmlServer: true
    }
  }
};

// Change the tasks to suit a production environment.
// I'm using a simple for loop to create a copy (by value) of the
// default files array, but changed the watch and sourcemaps options.
productionFiles = [];
for (let defaultFile of defaultConfig.files) {
  let prodFile = Object.create(defaultFile);
  prodFile.options.watch = false;
  prodFile.options.sourcemaps = false;

  productionFiles.push(prodFile);
}

const productionConfig = {
  files: productionFiles,
  options: {
    dest: 'dist',
    paint: false,
    verbose: false,
    browsersync: false
  }
};

module.exports = {
  'default': defaultConfig,
  'prod': productionConfig
};
