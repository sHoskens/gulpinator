// This file exposes all configuration for the gulp tasks. If the comments do
// not suffice, check out the README.md.

var assetsSrc = 'assets';
var config = {
  default: {
    // The folder containing all your html, css, styles, images, fonts,...
    // It's defined in above variable for reuse throughout this config.
    assetsSrc: assetsSrc,

    // Where you keep your uncompiled stylesheets (sass)
    stylesSrc: assetsSrc + '/styles',

    // Where you keep your uncompiled javascript files
    scriptSrc: assetsSrc + '/js',

    // Define where you keep your unoptimized images, and wether they should be optimized (or simply moved)
    images: {
      src: assetsSrc + '/img',
      optimize: true
    },

    // Sass configuration
    sass: {
      includePaths: [
        'vendor/compass-breakpoint/stylesheets'
      ]// Define additional paths Compass can use to compile your sass stylesheets.
    },

    // The desired build folder. After running'gulp build', this folder should
    // contain all the compiled code and files according to the specifications
    // defined below.
    defaultDest: 'public',

    // The entire folder/file structure in the folder defined below will simply
    // be copied into the defaultDest folder. Note that these folders will be
    // added to the defaultDest without the root additionalFiles folder defined
    // below.
    // In other words, if your additionalFiles folder is 'assets/other', and your
    // defaultDest folder is 'public', and you add a 'movies' folder to '/other',
    // gulp will place all the contents of this 'movies' folder in 'public/movies',
    // NOT 'public/other/movies'.
    additionalFiles: 'assets/other',

    // Angular configuration.
    // If it's not an angular project, you can safely set isAngularProject to
    // false and ignore or remove the other properties.
    angular: {
      isAngularProject: true,
      appName: 'app',
      angularSrc: 'angular',
      singleModule: false
    },

    // Booleans indicating desired gulp functionality
    // Activate es6 mode with babel. Configure in .babelrc file
    es6: true,

    // Add hashes to each asset, to allow cache busting
    // Note: you will not be able to inject css with browsersync using this method
    rev: false,

    // Use jsHint for linting
    jshint: true,

    // Use jscs for style linting
    jscs: true,

    // Gulp prints additional information in the console
    verbose: true,

    // Use minification for default js tasks. (can be overwritten in libraries
    // and bundles property)
    minify: true,

    // Use sourcemaps. (both for js and css)
    sourceMaps: true,

    // Use automated HTML injection.
    // If set to false, you can safely remove injection comments in the HTML and
    // add your own <script> tags. Note that the rev property above might cause
    // you some headaches in this case. :)
    // If set to true, make sure the correct HTML comments are added to all HTML
    // files in assetsSrc. For more information, see README.md
    useHtmlInjection: true,

    // Configuration for browsersync server. Use the proxy option if you want to
    // run browsersync as a proxy for, for example, a node server serving your html.
    // Set debug to false if you're not interested in browsersyncs messages in the
    // console.
    browsersync: {
      port: 8000,
      isProxy: false,
      proxyTarget: null,
      websockets: false,
      debug: true
    },

    // Define seperate bundles for your libraries.
    // There are three main options for including libraries in this workflow.
    // 1. Add libraries through a CDN or external link, directly into the HTML
    //    In this case, just supply an empty array to the libraries property
    // 2. Create one large library bundle, concatenating all it's files and
    //    automatically injecting the resulting bundle into the HTML.
    // 3. Create multiple library bundles, injecting them into the HTML where
    //    desired. See scriptsPerPage property below for more details.
    // Note that with options 2 and 3 we can do our own minification, which
    // might be handy if not all of the chosen libraries supply a .min.js file.
    libraries: [
      {
        name: 'utilities',
        minify: false,
        sources: [
          'vendor/lodash/dist/lodash.min.js',
          'vendor/jquery/dist/jquery.min.js'
        ]
      },
      {
        name: 'angularBundle',
        minify: true,
        sources: [
          'vendor/angular/angular.js',
          'vendor/angular-mocks/angular-mocks.js',
          'vendor/angular-ui-router/release/angular-ui-router.js',
          'vendor/restangular/dist/restangular.js'
        ]
      }
    ],

    // Define seperate bundles for your scripts in the assets folder. Works
    // in the same fashion as the libraries property above.
    // If empty, the gulp process wil default to concatenating all scripts found
    // in the assets folder in a single scripts.js file. If the array does
    // contain objects, it will only concatenate the files in the sources array
    // of each object.
    bundles: [
      {
        name: 'jsBundle',
        sources: [
          assetsSrc + '/js/example.js',
          assetsSrc + '/js/example2.js'
        ]
      }
    ],

    // Define extra stylesheets to be included in your css bundle. Usefull when
    // adding a plugin with it's own stylesheets or a 'library' like bootstrap.
    extraStylesheets: [],

    // If you want to add seperate script bundles to seperate html pages but still
    // want to use automated injection, you can define an array of all desired bundles
    // with an array of the pages they should be in. Don't supply the full path for
    // these files, just the name without the suffix. So assets/index.html simply
    // becomes 'index'.
    // IMPORTANT! You WILL need to define each seperate compiled stylesheet or js
    // bundle (including regular js, angular and external library bundles)
    seperateBundlesPerPage: {
      use: true,
      pages: [
        {
          names: ['index', 'simple-example'], // names of all the html pages to inject below bundles in
          styleBundles: ['main'], // names of all stylesheets for these page
          scriptBundles: ['utilities', 'jsBundle'] // names of all script bundles for these pages (including libraries!)
        },
        {
          names: ['angular-example'],
          styleBundles: ['main', 'todoApp'],
          scriptBundles: ['angularBundle', 'utilities', 'app', 'exampleTodoApp', 'exampleTodoApp-tmpl']
        }
      ]
    },

    // Choose which image to paint. 'Bazookas' or 'Gulpinator'. Leave empty to paint
    // nothing and be boring.
    paint: 'Gulpinator'
  }
};

module.exports = config;
