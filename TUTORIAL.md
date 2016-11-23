# Gulpinator tutorial

A small, step-by-step guide to configure a project with gulpinator.

###Index
1. Basics
  1.1 Moving Files
  1.2 Compiling stylesheets
  1.3 Compiling templates
  1.4 Javascript bundling
  1.5 Minification and sourcemaps
2. Advanced
  2.1 Webpack
  2.2 HTML Injection
  2.3 Global options
  2.4 Environment variables
  2.5 Development server

### 1 Basics
Configuration of your build process happens in *gulpinator.config.js*. This is a standard, .js file, running in a Node environment, so you can use constants, loops, and access the path variable.

*gulpinator.config.js* should, at a minimum, contain this:

```
const TASKS = require('gulpinator/utilities/taskNames');

const defaultConfig = {
  files: [
  
  ],
  options: {
    dest: 'public'
  }
}

module.exports = {
  'default': defaultConfig
};
```

Although this configuration file does not yet make gulpinator compile or move anything, it has the minimum requirements for it to run.
* TASKS: This constant is an object with all the available tasknames. This can be used to prevent typos in task definition.
* defaultConfig: The default configuration object, to be used if no environment variable is set.
* files: Each configuration object should contain a files array. In this array, you can define file objects containing a path (string, array of paths, or glob pattern), the task you want to run on these files, and an optional options object.
* options: The global options for gulpinator in this environment. The only required property is the dest property, telling gulpinator where to put the output of it's tasks.
* module.exports: Since we are using node, we need to export our configuration objects. Gulpinator requires one (and only one) of these objects to be called 'default'. See section 'Environment variables' for more info.

#### 1.1 Moving files
Let's start simple. Gulpinator allows you to move files from one directory, to your build directory. It's handy for moving fonts or other files which don't require any fancy tasks, but you don't want to simply place in your public folder. (which might not be added to git)

Our working directory is **src**. We want to move the file **src/fonts/helvetica.ttf** to our build directory **dest**. First, let's place **src** in a constant, since we will be refering to it a lot.

```
const TASKS = require('gulpinator/utilities/taskNames');
const ROOT = './src';

...
```

Next, in the files array of our default configuration object, we will tell gulpinator the target file, and the tasks which we want to put it through. 
```
files: [
  {
    target: ROOT + '/fonts/helvetica.ttf',
    task: TASKS.move,
  }
]
```
However, what if we want to move more font files in the future? Say, all the files with the .ttf extension in the fonts folder? We can use a *glob pattern* for this! For more info on glob patterns, take a quick look at [node-glob](https://github.com/isaacs/node-glob).
```
files: [
  {
    target: ROOT + '/fonts/*.ttf',
    task: TASKS.move,
  }
]
```
Running `gulp build` should now move all .ttf files to your destination folder.

#### 1.2 Compiling stylesheets
Next, let's do one of the most common occurrences of frontend automation: Style compilation. Gulpinator assumes you use sass, with the .scss extension. If we want to compile our sass files, located in **src/styles/**, we can change our files array to:

``` 
files: [
  {
    target: ROOT + '/fonts/*.ttf',
    task: TASKS.move
  },
  {
    target: ROOT + '/styles/**/*.scss',
    task: TASKS.styles
  }
]
```
Notice how our glob pattern is a little bit different then the one for fonts. The '\*\*/\*.scss' structure simply means all files in all subdirectories with the .scss extension.

Running `gulp build` now results in nicely compiled stylesheets. Remember to use sass' @import syntax to bundle your stylesheets, and to designate partials with an underscore. Gulpinator will create one bundled .css file for each regular .scss file, and skip any file that starts with an underscore. So if, for example, you have these files:
* main.scss
* _typography.scss
* _colors.scss
* _grid.scss
With main.scss looking like this:
```
@import 'typography';
@import 'colors';
@import 'grid';
```

Gulpinator will only generate a *main.scss* file, containing all the styles in these four files. These files are autoprefixed for modern browsers (usage > 5%) and cleaned with *gulp-clean-css*.

However, we would now like to place our stylesheets in one output folder, and our fonts in another. Change the files array to:
``` 
files: [
  {
    target: ROOT + '/fonts/*.ttf',
    task: TASKS.move,
    options: {
      dest: 'fonts'
    }
  },
  {
    target: ROOT + '/styles/**/*.scss',
    task: TASKS.styles,
    options: {
      dest: 'styles'
    }
  }
]
```
When executing `gulp build`, gulpinator will now place the fonts in **public/fonts**, and compile the sass code to **public/styles**.

#### 1.3 Compiling templates
Currently, gulpinator only supports .mustache templates and basic html.
Compiling a mustache template with gulpinator follows exactly the same structure as the style task.

```
{
  target: ROOT + '/templates/**/*.html',
  task: TASKS.templates
}
```

If we want to enable a templating language like mustache, we add it to the options like so:
```
{
  target: ROOT + '/templates/**/*.html',
  task: TASKS.templates,
  options: {
    templateLang: 'mustache'
  }
}
```

#### 1.4 Javascript bundling
Sometimes we just want to bundle a bunch of javascript in a single file. This can be some jQuery scripts, a few libraries, etc... Simply adding this object to the files array will take care of that:

```
{
  target: ROOT + '/scripts/bundle/**/*.js',
  task: TASKS.jsBundle,
  options: {
    dest: 'scripts'
  }
}
```

We have now created a single script bundle, with the default name **script-bundle**, in **public/scripts**. If we would define several script bundles, gulpinator will add an incrementing number to the end of the filename.

#### 1.5 Minification and sourcemaps
Simply compiling sass and javascript isn't quite enough these days. Let's minify our javascript, and add sourcemaps to both js and css. Additionaly, we want to enable a simple and controlled version of cache busting by adding a hash or version tag to the end of our filename. We also want to name our javascript bundle to 'my-script'. We can do this by changing the objects for our styles and javascript bundles in our files array to this:

```
{
  target: ROOT + '/styles/**/*.scss',
  task: TASKS.styles,
  options: {
    dest: 'styles',
    sourcemaps: true,
    hash: '1fe406r7lq22'
  }
},

{
  target: ROOT + '/scripts/bundle/**/*.js',
  task: TASKS.jsBundle,
  options: {
    dest: 'scripts',
    name: 'my-script',
    minify: true,
    sourcemaps: true,
    hash: '7y97T0h23l85'
  }
}
```
This will make gulpinator output *public/styles/main.1fe406r7lq22.css* and *public/scripts/my-script.min.7y97T0h23l85.js*, along with sourcemaps.

##2 Advanced
#### 2.1 Webpack
Gulpinator also supports webpack for more advanced functionality. The webpack task can be used as a wrapper around webpack, allowing all advantages of that system, or in it's simplest form as a way to compile an ES6 app.

If we want to compile an app, written with ES6 and using ES6 module syntax, we need an entry point. This is a .js file which is the starting point for the dependency management of the app. Configuration for this object would look like this:

```
// On top of our config file, require the path variable
const path = require('path');

...

const defaultConfig = {
  files: [
    {
      target: '',
      task: TASKS.webpack,
      options: {
        webpack: {
          entry: path.join(__dirname, ROOT, 'scripts', 'main.js'),
          output: path.join(__dirname, 'public', 'scripts')
        }
      }
    },
    ...
  ],
  ...
]
```

Notice how we first have to require the path variable to allow entering absolute paths, a best practice for a webpack config. Gulpinator builds a standard webpack.config which allows ES6 compilation with just the two parameters in options.webpack: An entry point and an output target. We don't need to supply a target or dest path, like with all the other gulp tasks, since this is just a gulp-powered wrapper for a standard webpack configuration.

This will, by default, create a *app.js* file in the destination defined in options.webpack.output. If you enter a word in options.name, it will use that word as a file name. If you enter `[hash]`, it will save the file with as a random hash .js.

If you want to create a more complex webpack configuration, you can. Simply define a webpack.config.js file in any way you desire (and don't forget to install all necessary packages) and enter the path in the options.customWebpackConfig parameter, like so:

```
{
  target: '',
  task: TASKS.webpack,
  customWebpackConfig: './path/to/webpack.config.js'
}
```

#### 2.2 HTML Injection
Gulpinator allows for automatic injection of all assets generated through the pipeline in html files. This means you can generate all your bundles, change their names or add hashes, and have a correct path entered in a <link> or <script> tag in your html files, in the order you want.

All this is quite easy to configure. There are two parts: You need to tell gulpinator you want to use injection, and you need to define the injection locations in your templates.

First, enable injection in your desired templates by switching on the option:

```
{
  target: ROOT + '/templates/**/*.html',
  task: TASKS.templates,
  options: {
    templateLang: 'mustache',
    useInjection: true
  }
}
```

Now, gulpinator will pass all injectable streams (Styles, js bundles, webpack) through the template stream. In this template stream, gulpinator will use gulp-inject to search for specifically formatted HTML comments, and inject correct <link> or <script> tags in between these comments. An example index.html page:

```
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
  
    <title>Inject example</title>
  
    <!-- compile-sass:css -->
    <!-- endinject -->
  </head>

  <body>
    <h1>This is an example page for HTML injection</h1>
  
    <!-- bundle-js:js -->
    <!-- endinject -->
  
    <!-- bundle-webpack:js -->
    <!-- endinject -->
  </body>
</html>
```

Each HTML injection comment consists of 3 parts. First, a comment with the targeted assets, a colon, and the extension of the assets. Next, a comment containing just 'endinject' to signify the end of the injection for this asset.

All assets compiled through the styles task require a `<!-- compile-sass:css -->` comment. For the javascript bundling task, use `<!-- compile-sass:css -->`. For the webpack task, use `<!-- bundle-webpack:js -->`.

If you give a name to the assets passing through a task with the options.name attribute, then you need to use `<!-- your-name:js -->`. You can use this to determine the order of bundles.

#### 2.3 Global options
Besides the files object in the defaultConfig object, you can also add an options object. In here, global configuration options are defined.

* dist: The global destination path. If you define a specific destination in a task, this destination will be appended to the global destination. So, for example, if the global options.dist is 'public', and the options.dist of the styles task is 'styles', then the styles assets will be saved to *public/styles*.
* paint: Choose false, 'gulpinator' or 'bazookas', to paint a silly ASCI thing. (if you're wondering: Bazookas is my employer)
* verbose: Set this boolean to true if you want gulpinator to log extra info, such as which target becomes which file.
* injectSuffix: Add a suffix to each injected file name. Does not change the files actual name, only the path in the injected tag.
* injectPrefix: Add a prefix to each injected asset's path. This only changes the injected path, not the actual file name or location. Use this to hack your injection with nasty php twig templates!

#### 2.4 Environment variables
Gulpinator also allows different environment variables. You probably want to define the default environment as a development environment with a less strict, fast approach, and a seperate production environment for a build ready for a life environment.
To do this, define a seperate configuration object with the options for a specific environment, and export it under the name of the environment, like so:

```
const defaultConfig = {
  files: [
    ...
  ],
  options: {
    dest: 'test',
    verbose: true
}

const productionConfig = {
  options: {
    dest: 'dist',
    verbose: false
  }
};

module.exports = {
  'default': defaultConfig,
  'prod': productionConfig
};
```

You can now call upon the default configuration with the command `gulp build`, and the production environment configuration with the command `gulp build --env=prod`.

Notice two things: First, you need to export the object under a string in module.exports, and this string needs to be exactly what you type as the `--env` flag in your command.

Next, notice how we have to explicitly set the options.verbose parameter to false in the production environment, even though the verbose option is default false. This is because the production configuration is a **merge** of the default configuration and the production configuration. This means that all properties that are not explicitly defined in the production configuration are the same in both environments. Defining a property in an environment configuration is actually overwriting that same property in the default configuration.

Because we simply merge each environment config with the default one, the files array is overwritten. If you want to change a specific option on a specific task, you either need to rebuild the entire files array and change that single value (bad), or just define each task in variables and rebuild the files array dynamically. (good)

####2.5 Development server
Besides the `gulp build` command, gulpinator also has a `gulp serve` command. This will create a browsersync development server on port 8000, serving files in your build folder as defined in options.dest. You don't need to enter .html in the url for any html files.

If you want gulpinator to watch for changes (for example, rerun the compile-sass task when you change a .scss file), enable the 'watch' option in each desired task like so:

``` 
...
{
  target: ROOT + '/styles/**/*.scss',
  task: TASKS.styles,
  options: {
    dest: 'styles',
    sourcemaps: true,
    watch: true
  }
},
...
```
A few caveats: Don't use randomized hashing (cache busting) with the development server. It's unnecessary in a dev environment, and will just result in a crazy amount of files cluttering your build folder.

For the webpack task, make sure the target is equal to options.webpack.entry. If you keep the target empty, gulpinator will not know where to look.