// The config.json file is used to set all config parameters. Refer to the README.md
// for more information.
const util        = require('gulp-util'),
      _           = require('lodash');

var baseConfig,
    config,
    hasCompiled = false,
    defaultConfig = {
      options: {
        verbose: false,
        sourcemaps: false,
        paint: 'gulpinator'
      }
    };

try {
  baseConfig = require(process.cwd() + '/gulpinator.config.js');
}
catch (err) {
  try {
    baseConfig = require('../defaults/gulpinator.config.js');
  }
  catch (err) {
    console.log('Default config file does not exist or contains errors! Make sure the file gulpinator.config.js exists in the root of your project and does not contain any syntax errors.');
    console.log(err);
  }
}

module.exports = {
  getConfig: function() {
    // Cache the config. If hasCompiled is false, we haven't yet checked the env variable
    if (!hasCompiled) {
      /*
       Check if an environment variable has been set in the gulp command. If so, modify the config file by merging the object with the same name as the env variable with the default config object. For example, if you use the command gulp build --env=dev, this will look for a dev object in the config.json and merge it's contents with the default object's contents.
       */
      config = _.merge(defaultConfig, baseConfig['default']);

      if (util.env.env && baseConfig[util.env.env]) {
        config = _.merge(config, baseConfig[util.env.env]);
      }

      hasCompiled = true;
    }

    return config;
  }
};
