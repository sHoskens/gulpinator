# Gulpinator basics

A step-by-step guide to configure a basic project with gulpinator.

##Index
[Minimal setup](#minimal)

[Moving Files](#moving)

[Compiling stylesheets](#stylesheets)

[Compiling templates](#templates)

[Javascript bundling](#bundling)

[Minification and sourcemaps](#minify)

<a name="minimal"></a>
## Minimal setup
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


<a name="moving"></a>
##Moving files
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

<a name="stylesheets"></a>
##Compiling stylesheets
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

<a name="templates"></a>
##Compiling templates
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

<a name="bundling"></a>
##Javascript bundling
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

<a name="minify"></a>
##Minification and sourcemaps
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

##Advanced
Continue to the [advanced tutorial](ADVANCED.md) for more info on webpack, html injection, development server and more!