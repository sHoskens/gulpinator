module.exports = function(gulp, plugins, config) {
  var Server = plugins.karma.Server;

  return function(done) {
    new Server({
      configFile: __dirname + '/../karma.conf.js'
    }, done).start();
  };
};
