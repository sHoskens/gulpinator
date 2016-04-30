/**
 * SIMPLE JS MODULE SYSTEM
 * NOTE this script is not loaded by default, edit index.html to load this script
 **/

// First: create a module namespace
// or get it from the globals
var bazookas = bazookas || {};

// then create the module itself
bazookas.main = (function() {
  // a module is basically a self executing function
  // returning an object with properties or methods
  var self = {};

  self.init = function() {
    // get all modules and execute the init functions
    for (var moduleName in bazookas) {
      if (bazookas.hasOwnProperty(moduleName)) {
        // check if module is not main!!
        var module = bazookas[moduleName];
        if (module !== self && typeof module.init === 'function') {
          module.init();
        }
      }
    }
  };

  return self;
})();

// NOTE jQuery is loaded by gulp.config.json (libraries)
// when document is ready execute init functions
$(bazookas.main.init);
