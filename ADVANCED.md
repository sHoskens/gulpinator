# Gulpinator advanced

A continuation of the basic step-by-step guide to show gulpinators more advanced functions.

## Index

[Webpack](#webpack)

[HTML Injection](#injection)

[Global options](#global)

[Environment variables](#environment)

[Development server](#server)

<a name="webpack"></a>
##Webpack
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

<a name="injection"></a>
##HTML Injection
Gulpinator allows for automatic injection of all assets generated through the pipeline in html files. This means you can generate all your bundles, change their names or add hashes, and have a correct path entered in a link or script tag in your html files, in the order you want.

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

Now, gulpinator will pass all injectable streams (Styles, js bundles, webpack) through the template stream. In this template stream, gulpinator will use gulp-inject to search for specifically formatted HTML comments, and inject correct link or script tags in between these comments. An example index.html page:

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

<a name="global"></a>
##Global options
Besides the files object in the defaultConfig object, you can also add an options object. In here, global configuration options are defined.

* dist: The global destination path. If you define a specific destination in a task, this destination will be appended to the global destination. So, for example, if the global options.dist is 'public', and the options.dist of the styles task is 'styles', then the styles assets will be saved to *public/styles*.
* paint: Choose false, 'gulpinator' or 'bazookas', to paint a silly ASCI thing. (if you're wondering: Bazookas is my employer)
* verbose: Set this boolean to true if you want gulpinator to log extra info, such as which target becomes which file.
* injectSuffix: Add a suffix to each injected file name. Does not change the files actual name, only the path in the injected tag.
* injectPrefix: Add a prefix to each injected asset's path. This only changes the injected path, not the actual file name or location. Use this to hack your injection with nasty php twig templates!

<a name="environment"></a>
##Environment variables
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

<a name="server"></a>
## Development server
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
