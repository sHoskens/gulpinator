var gulp          = require('gulp'),
    eventStream = require('event-stream'),
    compileCss    = require('../utilities/compileCss'),
    config        = require('../utilities/getConfig').getConfig(),
    exporter      = require('../utilities/createExportsObject');

var compileBundle = function(bundle) {
  var dest = config.defaultDest + '/' + config.dest.styles;
  if (bundle.dest && typeof bundle.dest === 'string') {
    dest = bundle.dest;
  }

  var options = {
    sass: bundle.sass,
    concat: bundle.concat
  };
  var filename = bundle.name + '.css';

  return compileCss(bundle.sources, filename, dest, options);
};

var compileBundlesAsSingleStream = function() {
  var streams = [];
  var options;

  if (config.bundles.length > 0) {
    for (var i = 0; i < config.bundles.length; i++) {
      if (config.bundles[i].type === 'style') {
        streams.push(compileBundle(config.bundles[i]));
      }
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
      if (config.bundles[i].type === 'style') {
        var bundle = config.bundles[i];
        streams.push({
          stream: compileBundle(bundle),
          name: bundle.name
        });
      }
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
    name: 'styles',
    sources: [config.stylesSrc + '/**/*.scss', config.stylesSrc + '/**/*.css'],
    sass: true,
    concat: false
  };
};

module.exports = {
  getStream: compileBundlesAsSingleStream,
  getTask: function() {
    return compileBundlesAsSingleStream;
  },
  getSeperateStreams: compileBundlesAsSeperateStreams
};
