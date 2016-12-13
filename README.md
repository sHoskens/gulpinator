#GULPINATOR

A gulp-based frontend bundler. It's purpose is to simplify setting up an advanced gulp/webpack configuration, yet allow a certain amount of flexibility.

Improvements and bugfixes are, of course, always welcome.

[Basic step by step tutorial](TUTORIAL.md)

[Advanced tutorial](ADVANCED.md)

##Contents

[Installation](#installation)

[Quick reference](#quickRef)

[Overview ](#overview)

[Extending Gulpinator](#extending)

[Work in progress: Wishlist](#roadmap)

<a name="installation"></a>
##Installation

Install using npm.

`npm install gulpinator --save`

Create a *gulpfile.js* in your project root, containing just this line:

```
var gulp = require('gulp');
require('gulpinator').initialize(gulp);
```

Since this is a basic gulpfile, you can choose to add additional tasks here.

For the standard configuration file with some sensible defaults, run `gulp init`. This will copy the default config file to your project root.

All configuration of gulpinator happens in *gulpinator.config.js* 

<a name="quickRef"></a>
##Quick Reference 
A quick reference for options for those already accustomed to gulpinator.

####TASKS
* styles: Compiles sass to css.
  * [REQUIRED] target: {String, Array} path glob pattern(s)
  * options.dest: {String} the destination path, added to the globally defined dest.
  * options.sourcemaps: {Boolean} wether to use sourcemaps. **Default: false**
  * options.hash: {String} suffix to be added to the file, used for cache busting. **Default: ''**
  * options.includePaths: {Array} Relative paths to additional css or scss files, outside your sass folder. (i.e. vendor files). **Default: []**
  
* jsBundle
  * [REQUIRED] target: {String, Array} glob pattern or array of glob patterns
  * options.dest: {String} the destination path, added to the globally defined dest.
  * options.sourcemaps: {Boolean} wether to use sourcemaps. **Default: false**
  * options.hash: {String} suffix to be added to the file, used for cache busting. **Default: ''**
  * options.minify: {Boolean} Wether to minify with uglify.js **Default: false**
  * options.name: {String} Name of the compiled bundle **Default: script-bundle**
  
* templates
  * [REQUIRED] target: {String, Array} glob pattern or array of glob patterns
  * options.dest: {String} the destination path, added to the globally defined dest.
  * options.templateLang: {String} the template language used. Currently only supports `mustache`. Leave empty for regular html. **Default: ''**
  * options.useInjection: {Boolean} Wether to use injection with gulp-inject. **Default: false**
  
* move
  * [REQUIRED] target: {String, Array} glob pattern or array of glob patterns
  * options.dest: {String} the destination path, added to the globally defined dest.
  
* webpack:
  * target: {String, Array} Not necessary. Target is defined in a webpack specific way due to incompatibility with glob patterns. Becomes necessary if you want to use the development server. In that case, point this to your webpack entry file.
  * options.dest: {String} Not necessary. Destination is defined in a webpack specific way, to keep in line with target being optional.
  * [REQUIRED] options.webpack: {Object} Simple webpack configuration. Either this or options.customWebpackConfig is required, not both.
  * [REQUIRED] options.webpack.entry: {String} Path to webpack's entry point, a javascript file. This file should use ES6 module syntax to require everything for the app. Prefer absolute paths using path.join()
  * [REQUIRED] options.webpack.output: {String} Path to webpacks output directory. Prefer absolute paths using path.join()
  * options.name: {String} If empty, webpack will bundle this file as *app.js*. If you enter a name, it will use that. If you enter `[hash]`, it will save the file with as a random hash .js. **Default: 'app'**
  * options.customWebpackConfig: {String} Only required if options.webpack is absent. Contains the path to your custom webpack config. 
  
###General options
Below the files array, you must place an options object. It only has one required property.

* [REQUIRED] options.dest: {String} The default path gulpinator will write it's output files to.
* options.verbose: {Boolean} If true, gulpinator will print some additional information to the terminal
* options.paint: {String} Choose an empty string, 'gulpinator' or 'bazookas', to paint a silly ASCI thing.
* options.injectPrefix: {String} Add a prefix to each injected asset's path. This only changes the injected path, not the actual file name or location. Use this to hack your injection with nasty php twig templates!
* options.browsersync: {Object} A configuration object for browsersync, the development server.
  * options.browsersync.port: {Integer} The port on which to run the dev server.
  * options.browsersync.isProxy: {Boolean} Run browsersync as a proxy for another server. Will still use css HMR and browser reloading on watched changes, but it will serve the pages through the proxy.
  * options.browsersync.proxyTarget: {Integer} The port number to proxy.
  * options.browsersync.websockets: {Boolean} Enable websockets.
  * options.browsersync.staticHtmlServer: {Boolean} If true, you can use pretty urls to visit html pages. So *http://localhost:8000/main* instead of *http://localhost:8000/main.html*.

<a name="overview"></a>
##3 Overview
This opinionated gulp-automated workflow assumes you want to build your entire project to a single destination folder, bundle your assets, write your stylesheets with Sass and javascript in ES6. It has optional support for mustache templating, and allows slotting in a more advanced webpack configuration.

Once you have configured *gulpinator.config.js* to do what you want, run gulpinator with any of these commands:

* `gulp init` Initializes gulpinator. It will copy the default configuration file for gulpinator.
* `gulp build` Build the entire project.
* `gulp serve` Build and serve the project on localhost.
* `gulp clean` Clears the build folder of everything except images.
* `gulp destroy` Completely clears the build folder.

<a name="extending"></a>
## Extending Gulpinator
The basic gulpfile.js looks like this, and initializes gulpinator like normal:
```
var gulp = require('gulp');
require('gulpinator').initialize(gulp);
```

To extend basic gulpinator functionality with your own, start by requiring gulpinator to a variable. Call the *initializeSubTasks* function instead of *initialize* to start the basic gulpinator setup. Next, you can overwrite existing tasks.

For example, if you want to overwrite the move-file with your own logic, you can do this in gulpfile.js:

```
const gulp = require('gulp');
const gulpinator = require('../index');

gulpinator.initializeSubTasks(gulp);

gulp.task('move-files', function() {
  // do something fancy.
});

gulpinator.initializeMainTasks(gulp);
```

After overwriting a task, you can simply call the *initializeMainTasks* function to add all tasks, including your overridden ones, to the *build* and *serve* task. 

If you want to define completely custom tasks and add them to the *build* and *serve* dependency queque, you can change the *gulpinator.buildTaskDependencies* array.

<a name="roadmap"></a>
## Roadmap
### Gulpinator modules
Create seperate npm packages with small gulpinator modules that can be slotted in. I can use this to add advanced features without increasing install time of the main gulpinator.

###Unit test support
I need to add more support for unit testing, but haven't yet decided on the best approach
for this. Once I've tested and decided on a technology stack for unit and/or integration
tests, I'll start automating it in here.


###More HTML templating support
Add support for several HTML templating preprocessors, like Jade, Handlebars,...
