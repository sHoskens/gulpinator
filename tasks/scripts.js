var gulp        = require('gulp'),
    eventStream = require('event-stream'),
    compileJs   = require('../utilities/compileJs'),
    config      = require('../utilities/getConfig').getConfig(),
    exporter    = require('../utilities/createExportsObject');

var compileBundle = function(bundle) {
  var dest = config.defaultDest + '/' + config.dest.scripts;
  var options = {
    isAngular: bundle.isAngular,
    minify: bundle.minify,
    lint: bundle.lint,
    es6: bundle.es6
  };
  var suffix = options.minify ? '.min' : '';
  var filename = bundle.name + suffix + '.js';

  return compileJs(bundle.sources, filename, dest, options);
};

var compileBundlesAsSingleStream = function() {
  var streams = [];
  var options;

  if (config.bundles.length > 0) {
    for (var i = 0; i < config.bundles.length; i++) {
      streams.push(compileBundle(config.bundles[i]));
    }

    return eventStream.merge(streams);
  }
  else {
    return compileBundle(createDefaultBundle());
  }
};

var compileBundlesAsSeperateStreams = function() {
  var streams = [];

  if (config.bundles.length > 0) {
    for (var i = 0; i < config.bundles.length; i++) {
      var bundle = config.bundles[i];
      streams.push({
        stream: compileBundle(bundle),
        name: bundle.name
      });
    }
  }
  else {
    streams.push({
      stream: compileBundle(createDefaultBundle()),
      name: 'main'
    });
  }

  return streams;
};

var createDefaultBundle = function() {
  return {
    name: 'main',
    sources: [config.scriptSrc + '/**/*.js'],
    isAngular: false,
    minify: config.minify,
    lint: config.jshint,
    es6: false
  };
};

module.exports = {
  getStream: compileBundlesAsSingleStream,
  getTask: function() {
    return compileBundlesAsSingleStream;
  },
  getSeperateStreams: compileBundlesAsSeperateStreams
};
