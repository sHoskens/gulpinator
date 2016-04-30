var util = require('gulp-util');

module.exports = {
  // jscs:disable
  paintBazookas: function () {
    util.log(util.colors.bgCyan("                                              "));
    util.log(util.colors.bgCyan(util.colors.white("  ______                      _               ")));
    util.log(util.colors.bgCyan(util.colors.white("  | ___ \\                    | |              ")));
    util.log(util.colors.bgCyan(util.colors.white("  | |_/ / __ _ _______   ___ | | ____ _ ___   ")));
    util.log(util.colors.bgCyan(util.colors.white("  | ___ \\/ _` |_  / _ \\ / _ \\| |/ / _` / __|  ")));
    util.log(util.colors.bgCyan(util.colors.white("  | |_/ / (_| |/ / (_) | (_) |   < (_| \\__ \\  ")));
    util.log(util.colors.bgCyan(util.colors.white("  \\____/ \\__,_/___\\___/ \\___/|_|\\_\\__,_|___/  ")));
    util.log(util.colors.bgCyan("                                              "));
  },

  paintGulpinator: function() {
    util.log(util.colors.bgMagenta("                        "));
    util.log(util.colors.bgMagenta(util.colors.white("        A           G   ")));
    util.log(util.colors.bgMagenta(util.colors.white("       [ ]          U   ")));
    util.log(util.colors.bgMagenta(util.colors.white("      (° °)         L   ")));
    util.log(util.colors.bgMagenta(util.colors.white("       |>|          P   ")));
    util.log(util.colors.bgMagenta(util.colors.white("    __/===\\__       I   ")));
    util.log(util.colors.bgMagenta(util.colors.white("   //| o=o |\\\\      N   ")));
    util.log(util.colors.bgMagenta(util.colors.white(" <]  | o=o |  [>    A   ")));
    util.log(util.colors.bgMagenta(util.colors.white("     \\=====/        T   ")));
    util.log(util.colors.bgMagenta(util.colors.white("    / / | \\ \\       O   ")));
    util.log(util.colors.bgMagenta(util.colors.white("   <_________>      R   ")));
    util.log(util.colors.bgMagenta("                        "));
  }
};
