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

    // Specific destination folder names
    dest: {
      scripts: 'scripts',
      styles: 'styles',
      images: 'img',
      angular: 'scripts',
      angularTemplates: 'templates'
    },

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

    // Use these configuration options only when building a symfony project in our current
    // CMS (based on Kunstmaan's CMS structure)
    symfony: {
      isSymfonyProject: false,
      injectFilesSrc: assetsSrc + '/views/Gulp-inject',
      injectTarget: assetsSrc + '/views/Partials'
    },

    // Fine tune the bundling of scripts. By default, gulpinator will just bundle all script files in the scriptSrc
    //folder into one js file. Use this if you want to bundle libraries, create seperate bundles of all scripts, etc...
    //Each object in this array consists of these properties
    // - name: The name of the desired output file. NOTE: you will use this name in the comment inject notation in HTML!
    // - minify: Wether to minify these files using uglify
    // - es6: Wether to run these files through babel's es6 compilation
    // - lint: Wether to lint these files with jslint and jscs.
    // - isAngular: Wether to run angular specific tasks on these files
    // - sources: An array of strings. Each string is a path to the desired files to be bundled. Accepts glob patterns. (i.e. assets/js/\*\*.\*.js)
    bundles: [
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
      },
      {
        name: 'scripts',
        minify: true,
        es6: true,
        lint: true,
        sources: [
          assetsSrc + '/js/**/*.js'
        ]
      }
    ],

    // Define extra stylesheets to be included in your css bundle. Usefull when
    // adding a plugin with it's own stylesheets or a 'library' like bootstrap.
    extraStylesheets: [],

    // Choose which image to paint. 'Bazookas' or 'Gulpinator'. Leave empty to paint
    // nothing and be boring.
    paint: 'Gulpinator'
  }
};

module.exports = config;
