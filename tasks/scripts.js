var gulp        = require('gulp'),
    eventStream = require('event-stream'),
    compileJs   = require('../utilities/compileJs'),
    config      = require('../utilities/getConfig').getConfig(),
    exporter    = require('../utilities/createExportsObject');

var compileScripts = function() {
  var streams = [];
  if (config.bundles.length > 0) {
    for (var i = 0; i < config.bundles.length; i++) {
      var bundle = config.bundles[i];
      streams.push(compileJs(bundle.sources, bundle.name + '.js', config.defaultDest, false));
    }

    return eventStream.merge(streams);
  }
  else {
    return compileJs(config.assetsSrc + '/js/**/*.js', 'scripts.js', config.defaultDest, false);
  }
};

module.exports = exporter(compileScripts);
